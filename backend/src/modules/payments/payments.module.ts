import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { BillingController } from './billing.controller';
import { WalletService } from './wallet.service';
import { PayoutService } from './payout.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { BakongService } from './bakong.service';
import { AbaPayProvider } from './providers/aba-pay.provider';
import { WingProvider } from './providers/wing.provider';
import { TrueMoneyProvider } from './providers/true-money.provider';
import { DatabaseModule } from '../../database/database.module';

// Requirement 12: Rewards and Payout System with Bakong integration
@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController, BillingController],
  providers: [
    WalletService,
    PayoutService,
    PaymentGatewayService,
    BakongService,
    AbaPayProvider,
    WingProvider,
    TrueMoneyProvider,
  ],
  exports: [
    WalletService,
    PayoutService,
    PaymentGatewayService,
    BakongService,
    AbaPayProvider,
    WingProvider,
    TrueMoneyProvider,
  ],
})
export class PaymentsModule {}
