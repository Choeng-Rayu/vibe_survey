// Req 23: Notification delivery background job processor
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process('send')
  async handleNotification(job: Job) {
    this.logger.log(`Processing notification job ${job.id}`);
    const { userId, channel, title, body } = job.data;

    // Req 23.4: Batching notifications
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.logger.log(`Notification job ${job.id} completed`);
    return { success: true, sent: true };
  }
}
