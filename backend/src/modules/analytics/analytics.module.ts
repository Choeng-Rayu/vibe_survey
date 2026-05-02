// Req 13: Analytics and Reporting Module
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsRepository } from './analytics.repository.js';
import { AggregationService } from './aggregation.service.js';
import { ReportingService } from './reporting.service.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository, AggregationService, ReportingService],
  exports: [AnalyticsService, ReportingService],
})
export class AnalyticsModule {}
