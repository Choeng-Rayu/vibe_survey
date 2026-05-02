import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WalletService } from './wallet.service';
import { BakongService } from './bakong.service';
import { AbaPayProvider } from './providers/aba-pay.provider';
import { WingProvider } from './providers/wing.provider';
import { TrueMoneyProvider } from './providers/true-money.provider';
import { WalletProvider, WithdrawalStatus } from '@prisma/client';
import { CreateWithdrawalDto } from './dto/withdrawal-request.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';

// Requirement 12.2: Support multiple payout methods
// Requirement 12.3: Mobile wallet integration
// Requirement 12.4: Withdrawal request processing
// Requirement 12.6: Payout retry logic with exponential backoff
@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);
  private readonly MIN_WITHDRAWAL = 5; // Minimum $5 withdrawal
  private readonly MAX_WITHDRAWAL = 500; // Maximum $500 per withdrawal
  private readonly DAILY_WITHDRAWAL_LIMIT = 1000; // Maximum $1000 per day
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly SUPPORTED_CURRENCIES = ['USD', 'KHR'];

  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly bakongService: BakongService,
    private readonly abaPayProvider: AbaPayProvider,
    private readonly wingProvider: WingProvider,
    private readonly trueMoneyProvider: TrueMoneyProvider,
  ) {}

  // Requirement 12.4: Create withdrawal request
  async createWithdrawal(userId: string, dto: CreateWithdrawalDto) {
    const wallet = await this.walletService.getWalletByUserId(userId);

    this.ensureProviderEnabled(dto.provider);
    this.validateProviderAccount(dto.provider, dto.provider_account);

    const { payoutAmount, payoutCurrency, amountInWalletCurrency } = this.normalizeWithdrawalAmount(
      dto.amount,
      dto.currency,
      wallet.currency,
      dto.provider,
    );

    // Req 12.7/12.8: convert to wallet currency for limits and balance checks
    await this.enforceWithdrawalLimits(wallet.id, amountInWalletCurrency, wallet.currency);

    const balance = Number(wallet.balance);
    if (balance < amountInWalletCurrency) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        wallet_id: wallet.id,
        amount: payoutAmount,
        currency: payoutCurrency,
        provider: dto.provider,
        provider_account: dto.provider_account,
        status: WithdrawalStatus.pending,
      },
    });

    // Deduct balance
    await this.walletService.deductBalance(userId, amountInWalletCurrency);

    // Process withdrawal asynchronously
    this.processWithdrawal(withdrawal.id).catch((err) => {
      this.logger.error(`Withdrawal processing failed: ${err.message}`);
    });

    this.logger.log(`Withdrawal created: ${withdrawal.id} for user ${userId} via ${dto.provider}`);
    return this.mapWithdrawalDto(withdrawal);
  }

  // Requirement 12.3: Validate account format for each provider
  private validateProviderAccount(provider: WalletProvider, account: string) {
    switch (provider) {
      case WalletProvider.bakong:
        if (!this.bakongService.validateBakongId(account)) {
          throw new BadRequestException('Invalid Bakong ID format');
        }
        break;
      case WalletProvider.aba_pay:
        if (!this.abaPayProvider.validateAccount(account)) {
          throw new BadRequestException('Invalid ABA Pay account format');
        }
        break;
      case WalletProvider.wing:
        if (!this.wingProvider.validateAccount(account)) {
          throw new BadRequestException('Invalid WING account format');
        }
        break;
      case WalletProvider.true_money:
        if (!this.trueMoneyProvider.validateAccount(account)) {
          throw new BadRequestException('Invalid TrueMoney account format');
        }
        break;
    }
  }

  private ensureProviderEnabled(provider: WalletProvider) {
    if (!this.isProviderEnabled(provider)) {
      throw new BadRequestException('Selected provider is not available');
    }
  }

  private isProviderEnabled(provider: WalletProvider): boolean {
    switch (provider) {
      case WalletProvider.bakong:
        return this.bakongService.isConfigured();
      case WalletProvider.aba_pay:
        return this.abaPayProvider.isConfigured();
      case WalletProvider.wing:
        return this.wingProvider.isConfigured();
      case WalletProvider.true_money:
        return this.trueMoneyProvider.isConfigured();
      default:
        return false;
    }
  }

  private normalizeWithdrawalAmount(
    amount: number,
    requestedCurrency: string | undefined,
    walletCurrency: string,
    provider: WalletProvider,
  ) {
    const normalizedWalletCurrency = this.normalizeCurrencyCode(walletCurrency);
    const payoutCurrency = this.normalizeCurrencyCode(
      requestedCurrency ?? normalizedWalletCurrency,
    );

    if (!this.isCurrencySupported(normalizedWalletCurrency)) {
      throw new BadRequestException(`Unsupported wallet currency: ${normalizedWalletCurrency}`);
    }

    if (!this.isCurrencySupported(payoutCurrency)) {
      throw new BadRequestException(`Unsupported currency: ${payoutCurrency}`);
    }

    const providerCurrencies = this.getProviderCurrencies(provider);
    if (!providerCurrencies.includes(payoutCurrency)) {
      throw new BadRequestException(`Provider does not support ${payoutCurrency}`);
    }

    const amountInWalletCurrency = this.convertAmount(
      amount,
      payoutCurrency,
      normalizedWalletCurrency,
    );

    return {
      payoutAmount: this.roundAmount(amount),
      payoutCurrency,
      amountInWalletCurrency: this.roundAmount(amountInWalletCurrency),
    };
  }

  private normalizeCurrencyCode(currency: string) {
    return currency.trim().toUpperCase();
  }

  private isCurrencySupported(currency: string) {
    return this.SUPPORTED_CURRENCIES.includes(currency);
  }

  private getProviderCurrencies(provider: WalletProvider): string[] {
    switch (provider) {
      case WalletProvider.bakong:
        return ['USD', 'KHR'];
      case WalletProvider.aba_pay:
      case WalletProvider.wing:
      case WalletProvider.true_money:
        return ['USD'];
      default:
        return [];
    }
  }

  private convertAmount(amount: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = this.getExchangeRateTable();
    const fromRate = rates.rates[fromCurrency];
    const toRate = rates.rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new BadRequestException(
        `Exchange rate unavailable for ${fromCurrency} to ${toCurrency}`,
      );
    }

    const amountInBase = fromCurrency === rates.base ? amount : amount / fromRate;
    return amountInBase * toRate;
  }

  private roundAmount(amount: number) {
    return Math.round(amount * 100) / 100;
  }

  private async enforceWithdrawalLimits(
    walletId: string,
    amountInWalletCurrency: number,
    walletCurrency: string,
  ) {
    if (amountInWalletCurrency < this.MIN_WITHDRAWAL) {
      throw new BadRequestException(`Minimum withdrawal is $${this.MIN_WITHDRAWAL}`);
    }

    if (amountInWalletCurrency > this.MAX_WITHDRAWAL) {
      throw new BadRequestException(`Maximum withdrawal is $${this.MAX_WITHDRAWAL}`);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: {
        wallet_id: walletId,
        created_at: { gte: startOfDay },
        status: {
          in: [WithdrawalStatus.pending, WithdrawalStatus.processing, WithdrawalStatus.completed],
        },
      },
      select: { amount: true, currency: true },
    });

    const normalizedWalletCurrency = this.normalizeCurrencyCode(walletCurrency);
    const dailyTotal = withdrawals.reduce((sum, withdrawal) => {
      const currency = this.normalizeCurrencyCode(withdrawal.currency);
      return (
        sum + this.convertAmount(Number(withdrawal.amount), currency, normalizedWalletCurrency)
      );
    }, 0);

    if (dailyTotal + amountInWalletCurrency > this.DAILY_WITHDRAWAL_LIMIT) {
      throw new BadRequestException('Daily withdrawal limit exceeded');
    }
  }

  // Process withdrawal with provider-specific logic
  private async processWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });

    if (!withdrawal) return;

    try {
      // Update status to processing
      await this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: WithdrawalStatus.processing },
      });

      let result: { success: boolean; transactionRef?: string; error?: string };

      // Route to appropriate provider
      switch (withdrawal.provider) {
        case WalletProvider.bakong:
          result = await this.bakongService.processWithdrawal({
            amount: Number(withdrawal.amount),
            currency: withdrawal.currency,
            bakongId: withdrawal.provider_account,
            description: `Vibe Survey withdrawal ${withdrawalId}`,
          });
          break;
        case WalletProvider.aba_pay:
          result = await this.abaPayProvider.processWithdrawal({
            amount: Number(withdrawal.amount),
            currency: withdrawal.currency,
            accountId: withdrawal.provider_account,
            reference: withdrawalId,
          });
          break;
        case WalletProvider.wing:
          result = await this.wingProvider.processWithdrawal({
            amount: Number(withdrawal.amount),
            currency: withdrawal.currency,
            accountId: withdrawal.provider_account,
            reference: withdrawalId,
          });
          break;
        case WalletProvider.true_money:
          result = await this.trueMoneyProvider.processWithdrawal({
            amount: Number(withdrawal.amount),
            currency: withdrawal.currency,
            accountId: withdrawal.provider_account,
            reference: withdrawalId,
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${withdrawal.provider}`);
      }

      if (result.success) {
        await this.prisma.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: WithdrawalStatus.completed,
            provider_ref: result.transactionRef,
            processed_at: new Date(),
          },
        });
        this.logger.log(`Withdrawal completed: ${withdrawalId}`);
      } else {
        await this.handleWithdrawalFailure(withdrawalId, result.error || 'Unknown error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.handleWithdrawalFailure(withdrawalId, message);
    }
  }

  // Requirement 12.6: Handle withdrawal failure with retry logic
  private async handleWithdrawalFailure(withdrawalId: string, error: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });

    if (!withdrawal) return;

    const retryCount = withdrawal.retry_count + 1;

    if (retryCount < this.MAX_RETRY_ATTEMPTS) {
      // Schedule retry with exponential backoff
      const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s

      await this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.pending,
          retry_count: retryCount,
          failure_reason: error,
        },
      });

      setTimeout(() => {
        this.processWithdrawal(withdrawalId).catch((err) => {
          this.logger.error(`Retry failed: ${err.message}`);
        });
      }, delay);

      this.logger.warn(
        `Withdrawal ${withdrawalId} scheduled for retry ${retryCount}/${this.MAX_RETRY_ATTEMPTS}`,
      );
    } else {
      await this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.failed,
          failure_reason: error,
        },
      });
      this.logger.error(
        `Withdrawal ${withdrawalId} failed after ${this.MAX_RETRY_ATTEMPTS} attempts: ${error}`,
      );
    }
  }

  // Get withdrawal history
  async getWithdrawals(userId: string): Promise<WithdrawalDto[]> {
    const wallet = await this.walletService.getWalletByUserId(userId);

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { wallet_id: wallet.id },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    return withdrawals.map((w) => this.mapWithdrawalDto(w));
  }

  // Get withdrawal status
  async getWithdrawalStatus(userId: string, withdrawalId: string) {
    const wallet = await this.walletService.getWalletByUserId(userId);

    const withdrawal = await this.prisma.withdrawal.findFirst({
      where: {
        id: withdrawalId,
        wallet_id: wallet.id,
      },
    });

    if (!withdrawal) {
      throw new BadRequestException('Withdrawal not found');
    }

    return this.mapWithdrawalDto(withdrawal);
  }

  // Requirement 12.6: Retry failed withdrawal
  async retryWithdrawal(userId: string, withdrawalId: string) {
    const wallet = await this.walletService.getWalletByUserId(userId);

    const withdrawal = await this.prisma.withdrawal.findFirst({
      where: {
        id: withdrawalId,
        wallet_id: wallet.id,
        status: WithdrawalStatus.failed,
      },
    });

    if (!withdrawal) {
      throw new BadRequestException('Withdrawal not found or cannot be retried');
    }

    if (withdrawal.retry_count >= this.MAX_RETRY_ATTEMPTS) {
      throw new BadRequestException('Maximum retry attempts reached');
    }

    // Reset status and trigger processing
    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: WithdrawalStatus.pending,
        failure_reason: null,
      },
    });

    this.processWithdrawal(withdrawalId).catch((err) => {
      this.logger.error(`Manual retry failed: ${err.message}`);
    });

    this.logger.log(`Withdrawal retry initiated: ${withdrawalId}`);
    return { success: true, message: 'Retry initiated' };
  }

  // Requirement 12.9: Payout reconciliation with providers
  async reconcileWithdrawals(limit = 50) {
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: {
        status: WithdrawalStatus.processing,
        provider_ref: { not: null },
      },
      orderBy: { updated_at: 'asc' },
      take: limit,
    });

    let updated = 0;

    for (const withdrawal of withdrawals) {
      const status = await this.getProviderStatus(withdrawal.provider, withdrawal.provider_ref);

      if (status.status === 'completed') {
        await this.prisma.withdrawal.update({
          where: { id: withdrawal.id },
          data: { status: WithdrawalStatus.completed, processed_at: new Date() },
        });
        updated += 1;
      }

      if (status.status === 'failed') {
        await this.handleWithdrawalFailure(withdrawal.id, 'Provider reported failure');
        updated += 1;
      }
    }

    return { checked: withdrawals.length, updated };
  }

  private async getProviderStatus(provider: WalletProvider, providerRef: string | null) {
    if (!providerRef) {
      return { status: 'pending' as const };
    }

    switch (provider) {
      case WalletProvider.aba_pay:
        return this.abaPayProvider.checkStatus(providerRef);
      case WalletProvider.wing:
        return this.wingProvider.checkStatus(providerRef);
      case WalletProvider.true_money:
        return this.trueMoneyProvider.checkStatus(providerRef);
      default:
        return { status: 'pending' as const };
    }
  }

  // Get supported payment methods
  getSupportedMethods() {
    const methods = [] as Array<{
      provider: WalletProvider;
      name: string;
      description: string;
      min_amount: number;
      currency: string;
      priority: number;
    }>;

    if (this.isProviderEnabled(WalletProvider.bakong)) {
      methods.push({
        provider: WalletProvider.bakong,
        name: 'Bakong',
        description: 'Cambodia National Payment Gateway',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 1,
      });
    }

    if (this.isProviderEnabled(WalletProvider.aba_pay)) {
      methods.push({
        provider: WalletProvider.aba_pay,
        name: 'ABA Pay',
        description: 'ABA Bank Mobile Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 2,
      });
    }

    if (this.isProviderEnabled(WalletProvider.wing)) {
      methods.push({
        provider: WalletProvider.wing,
        name: 'WING',
        description: 'WING Mobile Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 3,
      });
    }

    if (this.isProviderEnabled(WalletProvider.true_money)) {
      methods.push({
        provider: WalletProvider.true_money,
        name: 'TrueMoney',
        description: 'TrueMoney Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 4,
      });
    }

    return methods;
  }

  // Get exchange rates (for future multi-currency support)
  getExchangeRates() {
    const table = this.getExchangeRateTable();
    return { ...table, updated_at: new Date() };
  }

  private getExchangeRateTable(): { base: string; rates: Record<string, number> } {
    return {
      base: 'USD',
      rates: {
        USD: 1,
        KHR: 4100, // Cambodian Riel
      },
    };
  }

  private mapWithdrawalDto(withdrawal: any): WithdrawalDto {
    return {
      id: withdrawal.id,
      amount: Number(withdrawal.amount),
      currency: withdrawal.currency,
      provider: withdrawal.provider,
      provider_account: withdrawal.provider_account,
      status: withdrawal.status,
      failure_reason: withdrawal.failure_reason,
      created_at: withdrawal.created_at,
      processed_at: withdrawal.processed_at,
    };
  }
}
