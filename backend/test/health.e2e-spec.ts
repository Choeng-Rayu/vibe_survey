// Req 25.2, 25.3: E2E tests for health check endpoints
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from '../src/health/health.controller';
import { PrismaService } from '../src/database/prisma.service';

describe('Health Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const healthService = {
      check: jest.fn(async (checks: Array<() => unknown>) => {
        await Promise.all(checks.map((check) => check()));
        return { status: 'ok', info: {}, error: {}, details: {} };
      }),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: {} },
        { provide: HealthCheckService, useValue: healthService },
        {
          provide: PrismaHealthIndicator,
          useValue: { pingCheck: jest.fn(() => ({ database: { status: 'up' } })) },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(() => ({ memory_heap: { status: 'up' } })),
            checkRSS: jest.fn(() => ({ memory_rss: { status: 'up' } })),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: { checkStorage: jest.fn(() => ({ storage: { status: 'up' } })) },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('status');
        });
    });
  });

  describe('/health/liveness (GET)', () => {
    it('should return liveness status', () => {
      return request(app.getHttpServer())
        .get('/health/liveness')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('/health/readiness (GET)', () => {
    it('should return readiness status', () => {
      return request(app.getHttpServer())
        .get('/health/readiness')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('status');
        });
    });
  });
});
