// Req 20.7, Req 30.7: Metrics endpoint for Prometheus
import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service.js';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
