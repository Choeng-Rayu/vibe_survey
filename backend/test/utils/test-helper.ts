// Req 25.4: Test utilities and helpers
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';

export class TestHelper {
  static async createTestingModule(providers: any[]): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        ...providers,
        {
          provide: PrismaService,
          useValue: TestHelper.mockPrismaService(),
        },
      ],
    }).compile();
  }

  static mockPrismaService() {
    return {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      survey: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      campaign: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      response: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      webhook: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      apiKey: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((fn) => fn),
    };
  }

  static mockCacheService() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    };
  }

  static mockQueueService() {
    return {
      add: jest.fn(),
      process: jest.fn(),
    };
  }
}
