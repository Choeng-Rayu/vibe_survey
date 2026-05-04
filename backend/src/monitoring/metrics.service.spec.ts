// Req 25.1: Unit tests for MetricsService
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  describe('incrementHttpRequests', () => {
    it('should increment HTTP request counter', () => {
      expect(() => {
        service.incrementHttpRequests('GET', '/api/v1/surveys', 200);
      }).not.toThrow();
    });
  });

  describe('observeHttpDuration', () => {
    it('should observe HTTP request duration', () => {
      expect(() => {
        service.observeHttpDuration('GET', '/api/v1/surveys', 0.123);
      }).not.toThrow();
    });
  });

  describe('incrementSurveysCreated', () => {
    it('should increment surveys created counter', () => {
      expect(() => {
        service.incrementSurveysCreated('advertiser');
      }).not.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('should return metrics in Prometheus format', async () => {
      const metrics = await service.getMetrics();
      expect(typeof metrics).toBe('string');
      expect(metrics).toContain('# HELP');
      expect(metrics).toContain('# TYPE');
    });
  });

  describe('setActiveUsers', () => {
    it('should set active users gauge', () => {
      expect(() => {
        service.setActiveUsers('survey_taker', 100);
      }).not.toThrow();
    });
  });
});
