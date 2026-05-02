// Requirement 19: API Key Management Service
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateApiKeyDto, ApiKeyResponseDto, ApiKeyWithSecretDto } from './dto/api-key.dto.js';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  // Requirement 19.8: Generate API key for third-party integrations
  async create(userId: string, dto: CreateApiKeyDto): Promise<ApiKeyWithSecretDto> {
    // Generate random API key
    const key = `vsk_${crypto.randomBytes(32).toString('hex')}`;
    const keyPrefix = key.substring(0, 12); // vsk_ + 8 chars
    const keyHash = await bcrypt.hash(key, 10);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        user_id: userId,
        scopes: dto.scopes,
        expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      key_prefix: apiKey.key_prefix,
      scopes: apiKey.scopes,
      last_used_at: apiKey.last_used_at,
      expires_at: apiKey.expires_at,
      created_at: apiKey.created_at,
      key, // Only returned once
    };
  }

  // Requirement 19.8: Validate API key
  async validate(key: string): Promise<{ userId: string; scopes: string[] } | null> {
    if (!key || !key.startsWith('vsk_')) {
      return null;
    }

    const keyPrefix = key.substring(0, 12);
    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        key_prefix: keyPrefix,
        revoked_at: null,
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
    });

    for (const apiKey of apiKeys) {
      const isValid = await bcrypt.compare(key, apiKey.key_hash);
      if (isValid) {
        // Update last used timestamp
        await this.prisma.apiKey.update({
          where: { id: apiKey.id },
          data: { last_used_at: new Date() },
        });

        return {
          userId: apiKey.user_id,
          scopes: apiKey.scopes,
        };
      }
    }

    return null;
  }

  // List user's API keys
  async findAll(userId: string): Promise<ApiKeyResponseDto[]> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { user_id: userId, revoked_at: null },
      orderBy: { created_at: 'desc' },
    });

    return apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      key_prefix: key.key_prefix,
      scopes: key.scopes,
      last_used_at: key.last_used_at,
      expires_at: key.expires_at,
      created_at: key.created_at,
    }));
  }

  // Requirement 19.8: Revoke API key
  async revoke(userId: string, keyId: string): Promise<void> {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: keyId, user_id: userId },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { revoked_at: new Date() },
    });
  }

  // Rotate API key (revoke old, create new)
  async rotate(userId: string, keyId: string, dto: CreateApiKeyDto): Promise<ApiKeyWithSecretDto> {
    await this.revoke(userId, keyId);
    return this.create(userId, dto);
  }
}
