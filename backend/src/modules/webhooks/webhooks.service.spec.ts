// Req 25.1: Unit tests for WebhooksService
import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from '../../database/prisma.service';
import { TestHelper } from '../../../test/utils/test-helper';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([WebhooksService]);
    service = module.get<WebhooksService>(WebhooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a webhook with generated secret', async () => {
      const dto = { url: 'https://example.com/webhook', events: ['survey.created'] };
      const userId = 'user-123';
      const mockWebhook = { id: 'webhook-1', ...dto, user_id: userId, secret: 'generated-secret' };

      prisma.webhook.create.mockResolvedValue(mockWebhook);

      const result = await service.create(userId, dto);

      expect(result).toEqual(mockWebhook);
      expect(prisma.webhook.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_id: userId,
          url: dto.url,
          events: dto.events,
          secret: expect.any(String),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all active webhooks for user', async () => {
      const userId = 'user-123';
      const mockWebhooks = [
        { id: 'webhook-1', url: 'https://example.com/1', events: ['survey.created'] },
        { id: 'webhook-2', url: 'https://example.com/2', events: ['response.submitted'] },
      ];

      prisma.webhook.findMany.mockResolvedValue(mockWebhooks);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockWebhooks);
      expect(prisma.webhook.findMany).toHaveBeenCalledWith({
        where: { user_id: userId, deleted_at: null },
        select: expect.any(Object),
      });
    });
  });

  describe('remove', () => {
    it('should soft delete webhook', async () => {
      const webhookId = 'webhook-1';
      const userId = 'user-123';
      const mockWebhook = { id: webhookId, deleted_at: new Date() };

      prisma.webhook.update.mockResolvedValue(mockWebhook);

      const result = await service.remove(webhookId, userId);

      expect(result.deleted_at).toBeDefined();
      expect(prisma.webhook.update).toHaveBeenCalledWith({
        where: { id: webhookId, user_id: userId },
        data: { deleted_at: expect.any(Date) },
      });
    });
  });
});
