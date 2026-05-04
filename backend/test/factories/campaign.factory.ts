// Req 25.4: Test data factories for campaigns
import { CampaignStatus } from '@prisma/client';

export class CampaignFactory {
  static create(overrides: Partial<any> = {}) {
    return {
      id: 'campaign-' + Math.random().toString(36).substr(2, 9),
      name: 'Test Campaign',
      survey_id: 'survey-123',
      user_id: 'user-123',
      status: CampaignStatus.draft,
      budget: 1000,
      cost_per_response: 10,
      target_responses: 100,
      targeting_criteria: {
        age_min: 18,
        age_max: 65,
        countries: ['KH'],
      },
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      ...overrides,
    };
  }

  static createActive(overrides: Partial<any> = {}) {
    return this.create({
      status: CampaignStatus.active,
      ...overrides,
    });
  }

  static createMany(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
