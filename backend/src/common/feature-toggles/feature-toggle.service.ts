import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../cache/cache.service';

export interface FeatureFlagValue {
  name: string;
  is_enabled: boolean;
  description?: string | null;
  rollout_pct: number;
}

@Injectable()
export class FeatureToggleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async isEnabled(featureName: string, userId?: string): Promise<boolean> {
    const cacheKey = `feature:${featureName}`;
    const cached = await this.cacheService.get<FeatureFlagValue>(cacheKey);
    const flag =
      cached ??
      (await this.prisma.featureFlag.findUnique({
        where: { name: featureName },
      }));

    if (!flag) return false;
    if (!cached) await this.cacheService.set(cacheKey, flag, 300);
    if (!flag.is_enabled) return false;
    if (flag.rollout_pct >= 100) return true;
    if (!userId) return false;

    return this.bucketUser(userId) < flag.rollout_pct;
  }

  async list() {
    return this.prisma.featureFlag.findMany({ orderBy: { name: 'asc' } });
  }

  async upsert(
    featureName: string,
    dto: { is_enabled: boolean; description?: string; rollout_pct?: number },
    updatedBy?: string,
  ) {
    const rollout = Math.max(0, Math.min(100, dto.rollout_pct ?? 100));
    const flag = await this.prisma.featureFlag.upsert({
      where: { name: featureName },
      create: {
        name: featureName,
        is_enabled: dto.is_enabled,
        description: dto.description,
        rollout_pct: rollout,
        updated_by: updatedBy,
      },
      update: {
        is_enabled: dto.is_enabled,
        description: dto.description,
        rollout_pct: rollout,
        updated_by: updatedBy,
      },
    });
    await this.cacheService.del(`feature:${featureName}`);
    return flag;
  }

  private bucketUser(userId: string): number {
    let hash = 0;
    for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) % 100;
    return hash;
  }
}
