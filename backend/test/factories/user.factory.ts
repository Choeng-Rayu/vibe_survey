// Req 25.4: Test data factories for users
import { Role, TrustTier } from '@prisma/client';

export class UserFactory {
  static create(overrides: Partial<any> = {}) {
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: `test-${Date.now()}@example.com`,
      phone: '+85512345678',
      password_hash: '$2b$10$test',
      role: Role.survey_taker,
      trust_tier: TrustTier.bronze,
      is_verified: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      ...overrides,
    };
  }

  static createAdvertiser(overrides: Partial<any> = {}) {
    return this.create({
      role: Role.advertiser,
      trust_tier: TrustTier.gold,
      ...overrides,
    });
  }

  static createAdmin(overrides: Partial<any> = {}) {
    return this.create({
      role: Role.admin,
      trust_tier: TrustTier.platinum,
      ...overrides,
    });
  }

  static createMany(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
