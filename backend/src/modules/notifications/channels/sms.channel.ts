// Req 16.1: SMS notification channel
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsChannel {
  private readonly logger = new Logger(SmsChannel.name);

  async send(to: string, message: string): Promise<boolean> {
    this.logger.log(`Sending SMS to ${to}: ${message}`);
    // Integration with SMS provider (Twilio, AWS SNS, etc.)
    return true;
  }
}
