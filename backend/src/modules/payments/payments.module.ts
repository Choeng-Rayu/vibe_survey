import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WalletService } from './wallet.service';
import { PayoutService } from './payout.service';
import { BakongService } from './bakong.service';
import { DatabaseModule } from '../../database/database.module';

// Requirement 12: Rewards and Payout System with Bakong integration
@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController],
  providers: [WalletService, PayoutService, BakongService],
  exports: [WalletService, PayoutService, BakongService],
})
export class PaymentsModule {}
