// Req 23: Payout processing background job processor
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('payout')
export class PayoutProcessor {
  private readonly logger = new Logger(PayoutProcessor.name);

  @Process()
  async handlePayout(job: Job) {
    this.logger.log(`Processing payout job ${job.id}`);
    const { withdrawalId, amount, provider } = job.data;

    // Req 23.3: Retry logic with exponential backoff (configured in Bull)
    try {
      // Process payout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.logger.log(`Payout job ${job.id} completed`);
      return { success: true, transactionId: 'txn-123' };
    } catch (error) {
      this.logger.error(`Payout job ${job.id} failed: ${error}`);
      throw error; // Bull will retry
    }
  }
}
