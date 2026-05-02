// Req 25.4: Test data factories for surveys
import { SurveyStatus } from '@prisma/client';

export class SurveyFactory {
  static create(overrides: Partial<any> = {}) {
    return {
      id: 'survey-' + Math.random().toString(36).substr(2, 9),
      title: 'Test Survey',
      description: 'Test survey description',
      user_id: 'user-123',
      status: SurveyStatus.draft,
      definition: {
        title: 'Test Survey',
        description: 'Test survey description',
        questions: [
          {
            id: 'q1',
            type: 'single_choice',
            text: 'Test question?',
            required: true,
            options: ['Option 1', 'Option 2'],
          },
        ],
      },
      version: 1,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      ...overrides,
    };
  }

  static createActive(overrides: Partial<any> = {}) {
    return this.create({
      status: SurveyStatus.active,
      ...overrides,
    });
  }

  static createMany(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
