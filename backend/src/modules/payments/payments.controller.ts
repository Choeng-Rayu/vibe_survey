import { Controller, Get, Post, Put, Body, Query, UseGuards, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { PayoutService } from './payout.service';
import { TransactionQueryDto } from './dto/wallet.dto';
import { CreateWithdrawalDto } from './dto/withdrawal-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Requirement 12: Rewards and Payout System
@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly walletService: WalletService,
    private readonly payoutService: PayoutService,
  ) {}

  // Requirement 12.1: Get wallet balance
  @Get('wallet')
  getWallet(@CurrentUser('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Get('balance')
  getBalance(@CurrentUser('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  // Requirement 12.5: Transaction history
  @Get('transactions')
  getTransactions(@CurrentUser('userId') userId: string, @Query() query: TransactionQueryDto) {
    return this.walletService.getTransactionHistory(userId, query);
  }

  // Requirement 12.3: Bakong and mobile wallet withdrawals
  @Post('withdraw')
  createWithdrawal(@CurrentUser('userId') userId: string, @Body() dto: CreateWithdrawalDto) {
    return this.payoutService.createWithdrawal(userId, dto);
  }

  @Get('withdrawals')
  getWithdrawals(@CurrentUser('userId') userId: string) {
    return this.payoutService.getWithdrawals(userId);
  }

  @Get('withdrawals/:id/status')
  getWithdrawalStatus(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.payoutService.getWithdrawalStatus(userId, id);
  }

  // Requirement 12.6: Retry failed withdrawal
  @Put('withdrawals/:id/retry')
  retryWithdrawal(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.payoutService.retryWithdrawal(userId, id);
  }

  // Requirement 12.2: Get supported payment methods (Bakong first)
  @Get('payment-methods')
  getPaymentMethods() {
    return this.payoutService.getSupportedMethods();
  }

  // Requirement 12.7: Exchange rates
  @Get('exchange-rates')
  getExchangeRates() {
    return this.payoutService.getExchangeRates();
  }
}
