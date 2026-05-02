import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { EmailChannel } from './channels/email.channel.js';
import { SmsChannel } from './channels/sms.channel.js';
import { PushChannel } from './channels/push.channel.js';
import { InAppChannel } from './channels/in-app.channel.js';
import { SendNotificationDto } from './dto/notification.dto.js';

// Req 16: Multi-channel notification delivery
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailChannel: EmailChannel,
    private smsChannel: SmsChannel,
    private pushChannel: PushChannel,
    private inAppChannel: InAppChannel,
  ) {}

  async send(dto: SendNotificationDto) {
    const { userId, channels, type, title, body, data } = dto;

    const results = await Promise.allSettled(
      channels.map(async (channel) => {
        switch (channel) {
          case 'email':
            return this.emailChannel.send(userId, { type, title, body, data });
          case 'sms':
            return this.smsChannel.send(userId, { type, title, body, data });
          case 'push':
            return this.pushChannel.send(userId, { type, title, body, data });
          case 'in_app':
            return this.inAppChannel.send(userId, { type, title, body, data });
          default:
            throw new Error(`Unknown channel: ${channel}`);
        }
      }),
    );

    return {
      sent: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
      results,
    };
  }

  async getUserNotifications(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId, user_id: userId },
      data: { read_at: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { user_id: userId, read_at: null },
      data: { read_at: new Date() },
    });
  }
}
