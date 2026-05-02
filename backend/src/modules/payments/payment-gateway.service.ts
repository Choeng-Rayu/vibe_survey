import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  InvoiceStatus,
  PaymentGatewayProvider,
  PaymentMethodType,
  TransactionStatus,
  TransactionType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { WalletService } from './wallet.service';
import { BakongService } from './bakong.service';
import {
  AddPaymentMethodDto,
  CreatePaymentRequestDto,
  PaymentHistoryQueryDto,
  RefundPaymentRequestDto,
} from './dto/payment-request.dto';

// Requirement 17: Payment gateway integration for advertiser funding
@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private readonly MIN_TOPUP = 5;
  private readonly SUPPORTED_CURRENCIES = ['USD', 'KHR'];
  private readonly HIGH_RISK_AMOUNT = 5000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly bakongService: BakongService,
  ) {}

  // Requirement 17.1/17.3: Create payment intent and process gateway flow
  async createPayment(userId: string, dto: CreatePaymentRequestDto) {
    const provider = dto.provider ?? PaymentGatewayProvider.bakong;

    // Requirement 17.3: Bakong-only mobile wallet payments for now
    this.ensureProviderAllowed(dto.method, provider);
    this.validateCurrency(dto.currency);
    this.validateAmount(dto.amount);

    const wallet = await this.walletService.getOrCreateWallet(userId);
    const walletCurrency = this.normalizeCurrencyCode(wallet.currency);
    const paymentCurrency = this.normalizeCurrencyCode(dto.currency);
    const amountInWalletCurrency = this.convertAmount(dto.amount, paymentCurrency, walletCurrency);

    const risk = this.evaluateRisk(dto.amount, dto.method);
    const metadata = {
      source: 'payment_gateway',
      provider,
      method: dto.method,
      payment_amount: dto.amount,
      payment_currency: paymentCurrency,
      wallet_amount: amountInWalletCurrency,
      wallet_currency: walletCurrency,
      risk_level: risk.level,
      requires_review: risk.requires_review,
      retry_count: 0,
    };

    const transaction = await this.prisma.transaction.create({
      data: {
        wallet_id: wallet.id,
        type: TransactionType.credit,
        status: TransactionStatus.pending,
        amount: amountInWalletCurrency,
        currency: walletCurrency,
        description: 'Billing wallet top-up',
        metadata,
      },
    });

    const invoice = await this.prisma.invoice.create({
      data: {
        user_id: userId,
        payment_transaction_id: transaction.id,
        amount: dto.amount,
        currency: paymentCurrency,
        status: InvoiceStatus.pending,
        metadata: {
          provider,
          method: dto.method,
          wallet_amount: amountInWalletCurrency,
          wallet_currency: walletCurrency,
        },
      },
    });

    if (risk.requires_review) {
      this.logger.warn(`Payment ${transaction.id} flagged for review`);
      return this.buildPaymentResponse(transaction.id, TransactionStatus.pending, dto.amount, paymentCurrency, provider, invoice.id);
    }

    return this.createBakongPayment(transaction.id, dto.amount, paymentCurrency, invoice.id, metadata);
  }

  // Requirement 17.4/17.8: Retry failed payment attempts
  async retryPayment(userId: string, paymentId: string) {
    const transaction = await this.getPaymentTransaction(userId, paymentId);
    const transactionMetadata = this.readMetadata(transaction.metadata);

    if (transaction.status === TransactionStatus.completed) {
      throw new BadRequestException('Payment already completed');
    }

    const provider = transactionMetadata.provider as PaymentGatewayProvider | undefined;

    if (provider !== PaymentGatewayProvider.bakong) {
      throw new BadRequestException('Only Bakong payments can be retried');
    }

    return this.confirmBakongPayment(userId, paymentId);
  }

  // Requirement 17.5: Payment history and transaction tracking
  async getPaymentHistory(userId: string, query: PaymentHistoryQueryDto) {
    const wallet = await this.walletService.getOrCreateWallet(userId);
    const limit = query.limit ?? 50;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        wallet_id: wallet.id,
        metadata: {
          path: ['source'],
          equals: 'payment_gateway',
        },
        ...(query.cursor ? { id: { lt: query.cursor } } : {}),
      },
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });

    const hasMore = transactions.length > limit;
    const items = hasMore ? transactions.slice(0, limit) : transactions;

    const statusOverrides = await this.refreshPendingBakongPayments(items);

    return {
      payments: items.map(item => ({
        id: item.id,
        amount: Number(this.readMetadata(item.metadata).payment_amount ?? item.amount),
        currency: this.readMetadata(item.metadata).payment_currency ?? item.currency,
        status: statusOverrides.get(item.id) ?? item.status,
        provider: this.readMetadata(item.metadata).provider,
        method: this.readMetadata(item.metadata).method,
        created_at: item.created_at,
      })),
      next_cursor: hasMore ? items[items.length - 1].id : undefined,
      total: items.length,
    };
  }

  // Requirement 17.6: Refund processing and dispute handling
  async refundPayment(userId: string, dto: RefundPaymentRequestDto) {
    const transaction = await this.getPaymentTransaction(userId, dto.payment_id);
    const transactionMetadata = this.readMetadata(transaction.metadata);

    if (transaction.status !== TransactionStatus.completed) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const refundAmount = dto.amount ?? Number(transaction.amount);
    if (refundAmount <= 0 || refundAmount > Number(transaction.amount)) {
      throw new BadRequestException('Invalid refund amount');
    }

    const wallet = await this.walletService.getOrCreateWallet(userId);

    await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.reversed, metadata: { ...transactionMetadata, refund_reason: dto.reason } },
      }),
      this.prisma.transaction.create({
        data: {
          wallet_id: wallet.id,
          type: TransactionType.refund,
          status: TransactionStatus.completed,
          amount: -refundAmount,
          currency: transaction.currency,
          description: dto.reason ?? 'Refund processed',
          metadata: {
            source: 'payment_gateway',
            original_payment_id: transaction.id,
          },
        },
      }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: refundAmount } },
      }),
      this.prisma.invoice.updateMany({
        where: { payment_transaction_id: transaction.id },
        data: { status: InvoiceStatus.refunded },
      }),
    ]);

    this.logger.warn(`Payment ${transaction.id} refunded: ${refundAmount}`);
    return { payment_id: transaction.id, status: TransactionStatus.reversed };
  }

  // Requirement 17.9: Payment analytics and reconciliation
  async getPaymentAnalytics(userId: string) {
    const wallet = await this.walletService.getOrCreateWallet(userId);

    const totals = await this.prisma.transaction.aggregate({
      where: {
        wallet_id: wallet.id,
        metadata: { path: ['source'], equals: 'payment_gateway' },
      },
      _count: { id: true },
      _sum: { amount: true },
    });

    const byStatus = await this.prisma.transaction.groupBy({
      by: ['status'],
      where: {
        wallet_id: wallet.id,
        metadata: { path: ['source'], equals: 'payment_gateway' },
      },
      _count: { id: true },
      _sum: { amount: true },
    });

    return {
      total_payments: totals._count.id,
      total_amount: Number(totals._sum.amount ?? 0),
      status_breakdown: byStatus.map(item => ({
        status: item.status,
        count: item._count.id,
        amount: Number(item._sum.amount ?? 0),
      })),
    };
  }

  // Requirement 17.10: Automated billing and invoicing
  async getInvoices(userId: string, query: PaymentHistoryQueryDto) {
    const limit = query.limit ?? 50;

    const invoices = await this.prisma.invoice.findMany({
      where: { user_id: userId },
      orderBy: { issued_at: 'desc' },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = invoices.length > limit;
    const items = hasMore ? invoices.slice(0, limit) : invoices;

    return {
      invoices: items.map(invoice => ({
        id: invoice.id,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        status: invoice.status,
        issued_at: invoice.issued_at,
        paid_at: invoice.paid_at,
      })),
      next_cursor: hasMore ? items[items.length - 1].id : undefined,
      total: items.length,
    };
  }

  async getInvoice(userId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, user_id: userId },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    return {
      id: invoice.id,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      status: invoice.status,
      issued_at: invoice.issued_at,
      paid_at: invoice.paid_at,
      metadata: invoice.metadata,
    };
  }

  async addPaymentMethod(userId: string, dto: AddPaymentMethodDto) {
    if (dto.provider !== PaymentGatewayProvider.bakong || dto.method_type !== PaymentMethodType.mobile_wallet) {
      throw new BadRequestException('Only Bakong mobile wallet methods are supported');
    }

    if (!dto.token_ref) {
      throw new BadRequestException('Token reference is required');
    }

    if (dto.is_default) {
      await this.prisma.paymentMethod.updateMany({
        where: { user_id: userId, deleted_at: null },
        data: { is_default: false },
      });
    }

    const method = await this.prisma.paymentMethod.create({
      data: {
        user_id: userId,
        provider: dto.provider,
        method_type: dto.method_type,
        label: dto.label,
        last4: dto.last4,
        token_ref: dto.token_ref,
        is_default: dto.is_default ?? false,
      },
    });

    return this.mapPaymentMethod(method);
  }

  async listPaymentMethods(userId: string) {
    const methods = await this.prisma.paymentMethod.findMany({
      where: { user_id: userId, deleted_at: null },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    });

    return methods.map(method => this.mapPaymentMethod(method));
  }

  async removePaymentMethod(userId: string, methodId: string) {
    const method = await this.prisma.paymentMethod.findFirst({
      where: { id: methodId, user_id: userId, deleted_at: null },
    });

    if (!method) {
      throw new BadRequestException('Payment method not found');
    }

    await this.prisma.paymentMethod.update({
      where: { id: method.id },
      data: { deleted_at: new Date(), is_default: false },
    });

    return { success: true };
  }

  async confirmBakongPayment(userId: string, paymentId: string) {
    const transaction = await this.getPaymentTransaction(userId, paymentId);
    const transactionMetadata = this.readMetadata(transaction.metadata);
    const md5Hash = transactionMetadata.provider_ref as string | undefined;

    if (!md5Hash) {
      throw new BadRequestException('Missing Bakong reference');
    }

    const result = await this.bakongService.checkPayment(md5Hash);

    if (result.status === 'PAID') {
      await this.completePayment(transaction.id);
      return { payment_id: transaction.id, status: TransactionStatus.completed };
    }

    return { payment_id: transaction.id, status: transaction.status };
  }

  getExchangeRates(): { base: string; rates: Record<string, number>; updated_at: Date } {
    return {
      base: 'USD',
      rates: {
        USD: 1,
        KHR: 4100,
      },
      updated_at: new Date(),
    };
  }

  private validateAmount(amount: number) {
    if (amount < this.MIN_TOPUP) {
      throw new BadRequestException(`Minimum top-up is $${this.MIN_TOPUP}`);
    }
  }

  private validateCurrency(currency: string) {
    const normalized = this.normalizeCurrencyCode(currency);
    if (!this.SUPPORTED_CURRENCIES.includes(normalized)) {
      throw new BadRequestException(`Unsupported currency: ${normalized}`);
    }
  }

  private normalizeCurrencyCode(currency: string) {
    return currency.trim().toUpperCase();
  }

  private convertAmount(amount: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = this.getExchangeRates();
    const rateTable = rates.rates as Record<string, number>;
    const fromRate = rateTable[fromCurrency];
    const toRate = rateTable[toCurrency];

    if (!fromRate || !toRate) {
      throw new BadRequestException(`Exchange rate unavailable for ${fromCurrency} to ${toCurrency}`);
    }

    const amountInBase = fromCurrency === rates.base ? amount : amount / fromRate;
    return Math.round(amountInBase * toRate * 100) / 100;
  }

  private evaluateRisk(amount: number, method: PaymentMethodType) {
    if (amount >= this.HIGH_RISK_AMOUNT && method === PaymentMethodType.card) {
      return { level: 'high', requires_review: true };
    }

    if (amount >= this.HIGH_RISK_AMOUNT) {
      return { level: 'medium', requires_review: true };
    }

    return { level: 'low', requires_review: false };
  }

  private getDefaultProvider(method: PaymentMethodType) {
    return PaymentGatewayProvider.bakong;
  }

  private ensureProviderAllowed(method: PaymentMethodType, provider: PaymentGatewayProvider) {
    if (method !== PaymentMethodType.mobile_wallet) {
      throw new BadRequestException('Only mobile wallet payments are supported');
    }

    if (provider !== PaymentGatewayProvider.bakong) {
      throw new BadRequestException('Bakong is the only supported payment provider');
    }
  }

  private async createBakongPayment(
    transactionId: string,
    amount: number,
    currency: string,
    invoiceId?: string,
    metadata?: Record<string, unknown>,
  ) {
    if (!this.bakongService.isConfigured()) {
      throw new BadRequestException('Bakong is not configured');
    }

    const qrCode = this.bakongService.createKHQR({
      amount,
      currency,
      billNumber: transactionId,
    });

    const md5Hash = this.bakongService.generateMD5(qrCode);

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        metadata: {
          ...metadata,
          provider_ref: md5Hash,
          qr_code: qrCode,
        },
      },
    });

    const deeplink = await this.bakongService.generateDeeplink({ qrCode });

    return this.buildPaymentResponse(transactionId, TransactionStatus.pending, amount, currency, PaymentGatewayProvider.bakong, invoiceId, {
      type: 'qr',
      qr_code: qrCode,
      md5_hash: md5Hash,
      deep_link: deeplink,
    });
  }

  private async completePayment(
    transactionId: string,
    invoiceId?: string,
    metadata?: Record<string, unknown>,
    provider?: PaymentGatewayProvider,
  ) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) {
      throw new BadRequestException('Payment transaction not found');
    }

    const existingMetadata = this.readMetadata(transaction.metadata);

    const updates: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: TransactionStatus.completed,
          metadata: {
            ...existingMetadata,
            ...metadata,
            provider,
          },
        },
      }),
      this.prisma.wallet.update({
        where: { id: transaction.wallet_id },
        data: { balance: { increment: Number(transaction.amount) } },
      }),
    ];

    if (invoiceId) {
      updates.push(
        this.prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: InvoiceStatus.paid, paid_at: new Date() },
        }),
      );
    } else {
      updates.push(
        this.prisma.invoice.updateMany({
          where: { payment_transaction_id: transactionId },
          data: { status: InvoiceStatus.paid, paid_at: new Date() },
        }),
      );
    }

    await this.prisma.$transaction(updates);
  }

  private buildPaymentResponse(
    paymentId: string,
    status: TransactionStatus,
    amount: number,
    currency: string,
    provider: PaymentGatewayProvider,
    invoiceId?: string,
    nextAction?: Record<string, unknown>,
  ) {
    return {
      payment_id: paymentId,
      status,
      amount,
      currency,
      provider,
      invoice_id: invoiceId,
      next_action: nextAction,
    };
  }

  private async getPaymentTransaction(userId: string, paymentId: string) {
    const wallet = await this.walletService.getOrCreateWallet(userId);

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: paymentId,
        wallet_id: wallet.id,
        metadata: { path: ['source'], equals: 'payment_gateway' },
      },
    });

    if (!transaction) {
      throw new BadRequestException('Payment not found');
    }

    return transaction;
  }

  private mapPaymentMethod(method: { id: string; provider: PaymentGatewayProvider; method_type: PaymentMethodType; label?: string | null; last4?: string | null; is_default: boolean }) {
    return {
      id: method.id,
      provider: method.provider,
      method_type: method.method_type,
      label: method.label ?? undefined,
      last4: method.last4 ?? undefined,
      is_default: method.is_default,
    };
  }

  private readMetadata(metadata: unknown) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return {} as Record<string, unknown>;
    }

    return metadata as Record<string, unknown>;
  }

  private async refreshPendingBakongPayments(transactions: Array<{ id: string; status: TransactionStatus; metadata: unknown }>) {
    const updates = new Map<string, TransactionStatus>();

    for (const transaction of transactions) {
      if (transaction.status !== TransactionStatus.pending) {
        continue;
      }

      const metadata = this.readMetadata(transaction.metadata);
      const provider = metadata.provider as PaymentGatewayProvider | undefined;
      const md5Hash = metadata.provider_ref as string | undefined;

      if (provider !== PaymentGatewayProvider.bakong || !md5Hash) {
        continue;
      }

      const status = await this.bakongService.checkPayment(md5Hash);
      if (status.status === 'PAID') {
        await this.completePayment(transaction.id);
        updates.set(transaction.id, TransactionStatus.completed);
      }
    }

    return updates;
  }
}
