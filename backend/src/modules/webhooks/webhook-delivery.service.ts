// Req 22.3: Webhook delivery with retry logic and exponential backoff
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import * as crypto from 'crypto';

@Injectable()
export class WebhookDeliveryService {
  private readonly logger = new Logger(WebhookDeliveryService.name);
  private readonly maxRetries = 5;

  constructor(private prisma: PrismaService) {}

  async deliver(webhookId: string, eventType: string, payload: any) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || !webhook.is_active) return;

    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        webhook_id: webhookId,
        event_type: eventType,
        payload,
      },
    });

    await this.attemptDelivery(delivery.id, webhook.url, webhook.secret, payload, 1);
  }

  private async attemptDelivery(
    deliveryId: string,
    url: string,
    secret: string,
    payload: any,
    attempt: number,
  ) {
    try {
      const signature = this.generateSignature(payload, secret);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
        },
        body: JSON.stringify(payload),
      });

      await this.prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status_code: response.status,
          response: await response.text(),
          delivered_at: new Date(),
          attempt,
        },
      });

      if (!response.ok && attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        setTimeout(() => this.attemptDelivery(deliveryId, url, secret, payload, attempt + 1), delay);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Webhook delivery failed: ${err.message}`);
      if (attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        setTimeout(() => this.attemptDelivery(deliveryId, url, secret, payload, attempt + 1), delay);
      }
    }
  }

  private generateSignature(payload: any, secret: string): string {
    return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }

  verifySignature(payload: any, signature: string, secret: string): boolean {
    const expected = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  async getDeliveries(webhookId: string, limit = 50) {
    return this.prisma.webhookDelivery.findMany({
      where: { webhook_id: webhookId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }
}
