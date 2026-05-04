import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { IntegrationModule } from './modules/integration/integration.module';
import { HealthModule } from './health/health.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { TracingModule } from './common/tracing/tracing.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';
import { RedisThrottlerStorage } from './common/guards/redis-throttler.storage';
import { FeatureToggleGuard } from './common/guards/feature-toggle.guard';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditService } from './common/audit/audit.service';
import { AuditInterceptor } from './common/audit/audit.interceptor';
import { FeatureToggleService } from './common/feature-toggles/feature-toggle.service';
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
    IntegrationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisThrottlerStorage,
    AuditService,
    FeatureToggleService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: FeatureToggleGuard },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
  ],
})
export class AppModule {}
