import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto, TransactionQueryDto, WalletBalanceDto, TransactionHistoryDto } from './dto/wallet.dto';

// Requirement 12.1: Points calculation and wallet management
// Requirement 12.5: Transaction history and status tracking
@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly POINTS_TO_CURRENCY_RATE = 0.01; // 100 points = $1

  constructor(private readonly prisma: PrismaService) {}

  // Get or create wallet for user
  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { user_id: userId, balance: 0, points: 0 },
      });
      this.logger.log(`Wallet created for user ${userId}`);
    }

    return wallet;
  }

  // Requirement 12.1: Get wallet balance
  async getBalance(userId: string): Promise<WalletBalanceDto> {
    const wallet = await this.getOrCreateWallet(userId);

    const pendingWithdrawals = await this.prisma.withdrawal.aggregate({
      where: {
        wallet_id: wallet.id,
        status: { in: ['pending', 'processing'] },
      },
      _sum: { amount: true },
    });

    return {
      balance: Number(wallet.balance),
      points: wallet.points,
      currency: wallet.currency,
      pending_withdrawals: Number(pendingWithdrawals._sum.amount || 0),
    };
  }

  // Requirement 12.1: Award points for survey completion
  async awardPoints(userId: string, points: number, responseId: string, description: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const amount = points * this.POINTS_TO_CURRENCY_RATE;

    const transaction = await this.prisma.transaction.create({
      data: {
        wallet_id: wallet.id,
        response_id: responseId,
        type: TransactionType.credit,
        status: TransactionStatus.completed,
        amount,
        currency: wallet.currency,
        description,
      },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        points: { increment: points },
        balance: { increment: amount },
      },
    });

    this.logger.log(`Awarded ${points} points to user ${userId} for response ${responseId}`);
    return transaction;
  }

  // Requirement 12.8: Transaction rollback for fraud
  async rollbackTransaction(responseId: string, reason: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { response_id: responseId },
      include: { wallet: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === TransactionStatus.reversed) {
      throw new BadRequestException('Transaction already reversed');
    }

    // Create reversal transaction
    await this.prisma.transaction.create({
      data: {
        wallet_id: transaction.wallet_id,
        type: TransactionType.refund,
        status: TransactionStatus.completed,
        amount: -Number(transaction.amount),
        currency: transaction.currency,
        description: `Reversal: ${reason}`,
        metadata: { original_transaction_id: transaction.id },
      },
    });

    // Update original transaction status
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: TransactionStatus.reversed },
    });

    // Update wallet balance
    const points = Math.round(Number(transaction.amount) / this.POINTS_TO_CURRENCY_RATE);
    await this.prisma.wallet.update({
      where: { id: transaction.wallet_id },
      data: {
        points: { decrement: points },
        balance: { decrement: Number(transaction.amount) },
      },
    });

    this.logger.warn(`Transaction ${transaction.id} reversed: ${reason}`);
    return { success: true, reversed_amount: Number(transaction.amount) };
  }

  // Requirement 12.5: Transaction history with pagination
  async getTransactionHistory(userId: string, query: TransactionQueryDto): Promise<TransactionHistoryDto> {
    const wallet = await this.getOrCreateWallet(userId);
    const limit = query.limit || 50;

    const where: any = { wallet_id: wallet.id };
    if (query.type) {
      where.type = query.type;
    }
    if (query.cursor) {
      where.id = { lt: query.cursor };
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });

    const hasMore = transactions.length > limit;
    const items = hasMore ? transactions.slice(0, limit) : transactions;

    return {
      transactions: items.map(t => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        currency: t.currency,
        description: t.description || '',
        status: t.status,
        created_at: t.created_at,
      })),
      next_cursor: hasMore ? items[items.length - 1].id : undefined,
      total: items.length,
    };
  }

  // Deduct balance for withdrawal
  async deductBalance(userId: string, amount: number) {
    const wallet = await this.getOrCreateWallet(userId);

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });

    return { success: true, new_balance: Number(wallet.balance) - amount };
  }

  // Get wallet by user ID
  async getWalletByUserId(userId: string) {
    return this.getOrCreateWallet(userId);
  }

  // Calculate points from CPR
  calculatePoints(cpr: number): number {
    return Math.round(cpr * 100);
  }
}
