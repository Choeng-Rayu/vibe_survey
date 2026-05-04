// Req 22: Webhook management service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWebhookDto) {
    const secret = crypto.randomBytes(32).toString('hex');
    return this.prisma.webhook.create({
      data: {
        user_id: userId,
        url: dto.url,
        events: dto.events,
        secret,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.webhook.findMany({
      where: { user_id: userId, deleted_at: null },
      select: {
        id: true,
        url: true,
        events: true,
        is_active: true,
        last_used_at: true,
        created_at: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.webhook.findFirst({
      where: { id, user_id: userId, deleted_at: null },
    });
  }

  async update(id: string, userId: string, dto: UpdateWebhookDto) {
    return this.prisma.webhook.update({
      where: { id, user_id: userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.webhook.update({
      where: { id, user_id: userId },
      data: { deleted_at: new Date() },
    });
  }
}
