// Req 20.6: Distributed tracing service
import { Injectable } from '@nestjs/common';
import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

@Injectable()
export class TracingService {
  private readonly tracer = trace.getTracer('vibe-survey-backend');

  startSpan(name: string, attributes?: Record<string, any>): Span {
    return this.tracer.startSpan(name, { attributes });
  }

  async traceAsync<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, any>): Promise<T> {
    const span = this.startSpan(name, attributes);
    try {
      const result = await context.with(trace.setSpan(context.active(), span), fn);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const err = error as Error;
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span.recordException(err);
      throw error;
    } finally {
      span.end();
    }
  }

  traceSync<T>(name: string, fn: () => T, attributes?: Record<string, any>): T {
    const span = this.startSpan(name, attributes);
    try {
      const result = context.with(trace.setSpan(context.active(), span), fn);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const err = error as Error;
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span.recordException(err);
      throw error;
    } finally {
      span.end();
    }
  }

  addEvent(name: string, attributes?: Record<string, any>) {
    const span = trace.getActiveSpan();
    if (span) {
      span.addEvent(name, attributes);
    }
  }

  setAttribute(key: string, value: any) {
    const span = trace.getActiveSpan();
    if (span) {
      span.setAttribute(key, value);
    }
  }
}
