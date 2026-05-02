// Req 16.1: In-app notification channel
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';
import { NotificationChannel, NotificationStatus } from '@prisma/client';

@Injectable()
export class InAppChannel {
  private readonly logger = new Logger(InAppChannel.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(userId: string, title: string, body: string, data?: any): Promise<boolean> {
    await this.prisma.notification.create({
      data: {
        user_id: userId,
        channel: NotificationChannel.in_app,
        status: NotificationStatus.sent,
        title,
        body,
        data: data ?? {},
        sent_at: new Date(),
      },
    });
    this.logger.log(`In-app notification created for user ${userId}`);
    return true;
  }
}
