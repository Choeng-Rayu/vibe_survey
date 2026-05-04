import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CampaignsRepository } from './campaigns.repository';
import { TargetingController } from './targeting.controller';
import { TargetingService } from './targeting.service';
import { BudgetService } from './budget.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CampaignsController, TargetingController],
  providers: [CampaignsService, CampaignsRepository, TargetingService, BudgetService],
  exports: [CampaignsService, TargetingService, BudgetService],
})
export class CampaignsModule {}
