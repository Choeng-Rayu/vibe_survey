// Req 20.7, Req 30.7: Metrics export for monitoring systems
import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly registry: Registry;
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;
  private readonly surveysCreated: Counter;
  private readonly responsesSubmitted: Counter;
  private readonly payoutsProcessed: Counter;
  private readonly activeUsers: Gauge;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    // HTTP metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route'],
      registers: [this.registry],
    });

    // Business metrics
    this.surveysCreated = new Counter({
      name: 'surveys_created_total',
      help: 'Total surveys created',
      labelNames: ['user_role'],
      registers: [this.registry],
    });

    this.responsesSubmitted = new Counter({
      name: 'responses_submitted_total',
      help: 'Total survey responses submitted',
      labelNames: ['survey_id'],
      registers: [this.registry],
    });

    this.payoutsProcessed = new Counter({
      name: 'payouts_processed_total',
      help: 'Total payouts processed',
      labelNames: ['provider', 'status'],
      registers: [this.registry],
    });

    this.activeUsers = new Gauge({
      name: 'active_users',
      help: 'Number of active users',
      labelNames: ['role'],
      registers: [this.registry],
    });
  }

  incrementHttpRequests(method: string, route: string, status: number) {
    this.httpRequestsTotal.inc({ method, route, status });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  incrementSurveysCreated(userRole: string) {
    this.surveysCreated.inc({ user_role: userRole });
  }

  incrementResponsesSubmitted(surveyId: string) {
    this.responsesSubmitted.inc({ survey_id: surveyId });
  }

  incrementPayoutsProcessed(provider: string, status: string) {
    this.payoutsProcessed.inc({ provider, status });
  }

  setActiveUsers(role: string, count: number) {
    this.activeUsers.set({ role }, count);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
