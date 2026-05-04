import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';

// Req 16: SMS notification channel
@Injectable()
export class SmsChannel {
  private readonly logger = new Logger(SmsChannel.name);

  constructor(private prisma: PrismaService) {}

  async send(userId: string, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    if (!user?.phone) {
      throw new Error('User phone not found');
    }

    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    this.logger.log(`Sending SMS to ${user.phone}: ${payload.body}`);

    return { channel: 'sms', sent: true, recipient: user.phone };
  }
}
