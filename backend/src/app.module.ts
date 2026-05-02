import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './common/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { AiIntegrationModule } from './modules/ai-integration/ai-integration.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FilesModule } from './modules/files/files.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { TracingModule } from './common/tracing/tracing.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';
import { RedisThrottlerStorage } from './common/guards/redis-throttler.storage';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    DatabaseModule,
    CacheModule,
    TracingModule,
    MonitoringModule,
    HealthModule,
    AuthModule,
    UsersModule,
    SurveysModule,
    AiIntegrationModule,
    CampaignsModule,
    PaymentsModule,
    AnalyticsModule,
    AdminModule,
    RealtimeModule,
    NotificationsModule,
    FilesModule,
    JobsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisThrottlerStorage,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
  ],
})
export class AppModule {}
