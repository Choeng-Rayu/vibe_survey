// Req 16: Multi-channel notification delivery
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { EmailChannel } from './channels/email.channel.js';
import { SmsChannel } from './channels/sms.channel.js';
import { PushChannel } from './channels/push.channel.js';
import { InAppChannel } from './channels/in-app.channel.js';
import { SendNotificationDto } from './dto/notification.dto.js';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailChannel: EmailChannel,
    private readonly smsChannel: SmsChannel,
    private readonly pushChannel: PushChannel,
    private readonly inAppChannel: InAppChannel,
  ) {}

  // Req 16.1: Multi-channel notification delivery
  async send(dto: SendNotificationDto): Promise<boolean> {
    try {
      let success = false;

      switch (dto.channel) {
        case NotificationChannel.email:
          const user = await this.prisma.user.findUnique({ where: { id: dto.user_id } });
          if (user?.email) success = await this.emailChannel.send(user.email, dto.title, dto.body);
          break;
        case NotificationChannel.sms:
          const userPhone = await this.prisma.user.findUnique({ where: { id: dto.user_id } });
          if (userPhone?.phone) success = await this.smsChannel.send(userPhone.phone, dto.body);
          break;
        case NotificationChannel.push:
          success = await this.pushChannel.send(dto.user_id, dto.title, dto.body, dto.data);
          break;
        case NotificationChannel.in_app:
          success = await this.inAppChannel.send(dto.user_id, dto.title, dto.body, dto.data);
          break;
      }

      // Req 16.5: Delivery tracking
      await this.prisma.notification.create({
        data: {
          user_id: dto.user_id,
          channel: dto.channel,
          status: success ? NotificationStatus.sent : NotificationStatus.failed,
          title: dto.title,
          body: dto.body,
          data: dto.data ?? {},
          template_id: dto.template_id,
          sent_at: success ? new Date() : null,
        },
      });

      return success;
    } catch (error) {
      this.logger.error(`Notification send failed: ${error}`);
      return false;
    }
  }

  // Req 16.3: Notification preferences
  async getUserNotifications(userId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      skip: params?.skip ?? 0,
      take: params?.take ?? 20,
    });
  }

  // Req 16.8: Notification history
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read_at: new Date() },
    });
  }
}
