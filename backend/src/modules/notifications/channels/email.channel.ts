import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';

// Req 16: Email notification channel
@Injectable()
export class EmailChannel {
  private readonly logger = new Logger(EmailChannel.name);

  constructor(private prisma: PrismaService) {}

  async send(userId: string, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    this.logger.log(`Sending email to ${user.email}: ${payload.title}`);

    return { channel: 'email', sent: true, recipient: user.email };
  }
}
