// Req 16: Notification System Module
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { TemplateService } from './template.service.js';
import { EmailChannel } from './channels/email.channel.js';
import { SmsChannel } from './channels/sms.channel.js';
import { PushChannel } from './channels/push.channel.js';
import { InAppChannel } from './channels/in-app.channel.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, TemplateService, EmailChannel, SmsChannel, PushChannel, InAppChannel],
  exports: [NotificationsService, TemplateService],
})
export class NotificationsModule {}
