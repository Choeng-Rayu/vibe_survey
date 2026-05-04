// Req 25.1: Unit tests for TracingService
import { TracingService } from './tracing.service';

describe('TracingService', () => {
  let service: TracingService;

  beforeEach(() => {
    service = new TracingService();
  });

  describe('traceAsync', () => {
    it('should trace async operation successfully', async () => {
      const result = await service.traceAsync('test-operation', async () => {
        return 'success';
      });

      expect(result).toBe('success');
    });

    it('should handle errors in async operations', async () => {
      await expect(
        service.traceAsync('test-operation', async () => {
          throw new Error('Test error');
        }),
      ).rejects.toThrow('Test error');
    });
  });

  describe('traceSync', () => {
    it('should trace sync operation successfully', () => {
      const result = service.traceSync('test-operation', () => {
        return 'success';
      });

      expect(result).toBe('success');
    });

    it('should handle errors in sync operations', () => {
      expect(() => {
        service.traceSync('test-operation', () => {
          throw new Error('Test error');
        });
      }).toThrow('Test error');
    });
  });

  describe('startSpan', () => {
    it('should create a span with attributes', () => {
      const span = service.startSpan('test-span', { key: 'value' });
      expect(span).toBeDefined();
    });
  });
});
