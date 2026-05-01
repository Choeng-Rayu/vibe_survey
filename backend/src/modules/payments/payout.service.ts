import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WalletService } from './wallet.service';
import { BakongService } from './bakong.service';
import { AbaPayProvider } from './providers/aba-pay.provider';
import { WingProvider } from './providers/wing.provider';
import { TrueMoneyProvider } from './providers/true-money.provider';
import { WalletProvider, WithdrawalStatus } from '@prisma/client';
import { CreateWithdrawalDto, WithdrawalDto } from './dto/withdrawal.dto';

// Requirement 12.2: Support multiple payout methods
// Requirement 12.3: Mobile wallet integration
// Requirement 12.4: Withdrawal request processing
// Requirement 12.6: Payout retry logic with exponential backoff
@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);
  private readonly MIN_WITHDRAWAL = 5; // Minimum $5 withdrawal
  private readonly MAX_RETRY_ATTEMPTS = 3;

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
    // Validate minimum withdrawal
    if (dto.amount < this.MIN_WITHDRAWAL) {
      throw new BadRequestException(`Minimum withdrawal is $${this.MIN_WITHDRAWAL}`);
    }

    // Validate account format based on provider
    this.validateProviderAccount(dto.provider, dto.provider_account);

    const wallet = await this.walletService.getWalletByUserId(userId);
    const balance = Number(wallet.balance);

    if (balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        wallet_id: wallet.id,
        amount: dto.amount,
        currency: dto.currency,
        provider: dto.provider,
        provider_account: dto.provider_account,
        status: WithdrawalStatus.pending,
      },
    });

    // Deduct balance
    await this.walletService.deductBalance(userId, dto.amount);

    // Process withdrawal asynchronously
    this.processWithdrawal(withdrawal.id).catch(err => {
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
        this.processWithdrawal(withdrawalId).catch(err => {
          this.logger.error(`Retry failed: ${err.message}`);
        });
      }, delay);

      this.logger.warn(`Withdrawal ${withdrawalId} scheduled for retry ${retryCount}/${this.MAX_RETRY_ATTEMPTS}`);
    } else {
      await this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.failed,
          failure_reason: error,
        },
      });
      this.logger.error(`Withdrawal ${withdrawalId} failed after ${this.MAX_RETRY_ATTEMPTS} attempts: ${error}`);
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

    return withdrawals.map(w => this.mapWithdrawalDto(w));
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

    this.processWithdrawal(withdrawalId).catch(err => {
      this.logger.error(`Manual retry failed: ${err.message}`);
    });

    this.logger.log(`Withdrawal retry initiated: ${withdrawalId}`);
    return { success: true, message: 'Retry initiated' };
  }

  // Get supported payment methods
  getSupportedMethods() {
    return [
      {
        provider: WalletProvider.bakong,
        name: 'Bakong',
        description: 'Cambodia National Payment Gateway',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 1,
      },
      {
        provider: WalletProvider.aba_pay,
        name: 'ABA Pay',
        description: 'ABA Bank Mobile Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 2,
      },
      {
        provider: WalletProvider.wing,
        name: 'WING',
        description: 'WING Mobile Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 3,
      },
      {
        provider: WalletProvider.true_money,
        name: 'TrueMoney',
        description: 'TrueMoney Wallet',
        min_amount: this.MIN_WITHDRAWAL,
        currency: 'USD',
        priority: 4,
      },
    ];
  }

  // Get exchange rates (for future multi-currency support)
  getExchangeRates() {
    return {
      base: 'USD',
      rates: {
        USD: 1,
        KHR: 4100, // Cambodian Riel
      },
      updated_at: new Date(),
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
