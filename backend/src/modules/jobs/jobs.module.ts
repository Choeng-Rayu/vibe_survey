// Req 23: Background Job Processing Module
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SurveyImportProcessor } from './processors/survey-import.processor.js';
import { AnalyticsProcessor } from './processors/analytics.processor.js';
import { PayoutProcessor } from './processors/payout.processor.js';
import { NotificationProcessor } from './processors/notification.processor.js';

@Module({
  imports: [
    // Req 23.1: Bull queue configuration with Redis
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    // Req 23.2, 23.3: Job scheduling, retry logic with exponential backoff
    BullModule.registerQueue(
      { name: 'survey-import', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } } },
      { name: 'analytics', defaultJobOptions: { attempts: 2, backoff: { type: 'exponential', delay: 1000 } } },
      { name: 'payout', defaultJobOptions: { attempts: 5, backoff: { type: 'exponential', delay: 5000 } } },
      { name: 'notification', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } } },
    ),
  ],
  providers: [SurveyImportProcessor, AnalyticsProcessor, PayoutProcessor, NotificationProcessor],
  exports: [BullModule],
})
export class JobsModule {}
