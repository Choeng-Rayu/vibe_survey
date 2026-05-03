import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';

// Req 16: In-app notification channel
@Injectable()
export class InAppChannel {
  private readonly logger = new Logger(InAppChannel.name);

  constructor(private prisma: PrismaService) {}

  async send(userId: string, payload: any) {
    const notification = await this.prisma.notification.create({
      data: {
        user_id: userId,
        channel: 'in_app',
        title: payload.title,
        body: payload.body,
        data: { ...(payload.data || {}), type: payload.type },
        read_at: null,
      },
    });

    this.logger.log(`Created in-app notification for user ${userId}`);

    return { channel: 'in_app', sent: true, notificationId: notification.id };
  }
}
