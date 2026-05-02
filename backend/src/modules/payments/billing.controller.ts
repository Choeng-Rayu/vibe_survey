import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WalletService } from './wallet.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { AddPaymentMethodDto, CreatePaymentRequestDto, PaymentHistoryQueryDto } from './dto/payment-request.dto';

// Requirement 17: Billing and payment gateway endpoints
@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  // Requirement 17.5: Billing wallet balance
  @Get('wallet')
  getWallet(@CurrentUser('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  // Requirement 17.1: Create top-up payment
  @Post('wallet/topup')
  createTopUp(@CurrentUser('userId') userId: string, @Body() dto: CreatePaymentRequestDto) {
    return this.paymentGatewayService.createPayment(userId, dto);
  }

  // Requirement 17.5: Payment transaction history
  @Get('wallet/transactions')
  getPaymentHistory(@CurrentUser('userId') userId: string, @Query() query: PaymentHistoryQueryDto) {
    return this.paymentGatewayService.getPaymentHistory(userId, query);
  }

  // Requirement 17.3: Add payment method
  @Post('payment-methods')
  addPaymentMethod(@CurrentUser('userId') userId: string, @Body() dto: AddPaymentMethodDto) {
    return this.paymentGatewayService.addPaymentMethod(userId, dto);
  }

  @Get('payment-methods')
  listPaymentMethods(@CurrentUser('userId') userId: string) {
    return this.paymentGatewayService.listPaymentMethods(userId);
  }

  @Delete('payment-methods/:id')
  removePaymentMethod(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.paymentGatewayService.removePaymentMethod(userId, id);
  }

  // Requirement 17.10: Billing invoices
  @Get('invoices')
  getInvoices(@CurrentUser('userId') userId: string, @Query() query: PaymentHistoryQueryDto) {
    return this.paymentGatewayService.getInvoices(userId, query);
  }

  @Get('invoices/:id')
  getInvoice(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.paymentGatewayService.getInvoice(userId, id);
  }
}
