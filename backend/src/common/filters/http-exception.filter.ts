import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

// Req 1.7: Custom exception filter, Req 20.1: Standardized error format
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as Record<string, unknown>)['message']
        : exceptionResponse;

    const errorBody = {
      success: false,
      error: {
        code: status,
        message: typeof message === 'string' ? message : 'An error occurred',
        details: Array.isArray(message) ? message : [],
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    this.logger.warn(`${request.method} ${request.url} → ${status}`);
    response.status(status).json(errorBody);
  }
}

// Req 20.1: Catch-all for unexpected errors
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal server error';

    this.logger.error(
      `Unhandled exception: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message: 'Internal server error',
        details: [],
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
