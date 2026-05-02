// Req 25.1: Unit tests for ApiKeyService
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '../../database/prisma.service';
import { TestHelper } from '../../../test/utils/test-helper';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.createTestingModule([ApiKeyService]);
    service = module.get<ApiKeyService>(ApiKeyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create API key with hashed secret', async () => {
      const dto = { name: 'Test Key', scopes: ['surveys:read'] };
      const userId = 'user-123';
      const mockApiKey = {
        id: 'key-1',
        name: dto.name,
        key_prefix: 'vsk_12345678',
        scopes: dto.scopes,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-key');
      prisma.apiKey.create.mockResolvedValue(mockApiKey);

      const result = await service.create(userId, dto);

      expect(result.key).toMatch(/^vsk_[a-f0-9]{64}$/);
      expect(prisma.apiKey.create).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('should validate correct API key', async () => {
      const key = 'vsk_' + 'a'.repeat(64);
      const mockApiKey = {
        id: 'key-1',
        key_hash: 'hashed',
        user_id: 'user-123',
        scopes: ['surveys:read'],
        expires_at: null,
        revoked_at: null,
        user: { id: 'user-123', role: 'advertiser' },
      };

      prisma.apiKey.findFirst.mockResolvedValue(mockApiKey);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prisma.apiKey.update.mockResolvedValue(mockApiKey);

      const result = await service.validate(key);

      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
    });

    it('should reject expired API key', async () => {
      const key = 'vsk_' + 'a'.repeat(64);
      const mockApiKey = {
        id: 'key-1',
        key_hash: 'hashed',
        expires_at: new Date(Date.now() - 1000),
        revoked_at: null,
      };

      prisma.apiKey.findFirst.mockResolvedValue(mockApiKey);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validate(key);

      expect(result).toBeNull();
    });
  });

  describe('revoke', () => {
    it('should revoke API key', async () => {
      const keyId = 'key-1';
      const userId = 'user-123';
      const mockApiKey = { id: keyId, revoked_at: new Date() };

      prisma.apiKey.update.mockResolvedValue(mockApiKey);

      const result = await service.revoke(keyId, userId);

      expect(result.revoked_at).toBeDefined();
    });
  });
});
