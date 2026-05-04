// Req 22: Webhook module configuration
import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller.js';
import { WebhooksService } from './webhooks.service.js';
import { WebhookDeliveryService } from './webhook-delivery.service.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookDeliveryService],
  exports: [WebhooksService, WebhookDeliveryService],
})
export class WebhooksModule {}
