// Req 25.2: E2E tests for metrics endpoint
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import { MetricsController } from '../src/monitoring/metrics.controller';
import { MetricsService } from '../src/monitoring/metrics.service';

describe('Metrics Endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/metrics (GET)', () => {
    it('should return Prometheus metrics', () => {
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .expect((res: Response) => {
          expect(res.text).toContain('# HELP');
          expect(res.text).toContain('# TYPE');
        });
    });

    it('should include custom metrics', () => {
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect((res: Response) => {
          expect(res.text).toContain('http_requests_total');
          expect(res.text).toContain('http_request_duration_seconds');
        });
    });
  });
});
