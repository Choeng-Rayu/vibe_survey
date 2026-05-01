export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
  meta: {
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    has_more: boolean;
    next_cursor: string | null;
    total_count: number;
    limit: number;
  };
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface SortParams {
  sort?: string;
}

export interface FilterParams {
  filter?: Record<string, string | string[]>;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;

export class ApiClientError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  requestId?: string;

  constructor(options: {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
    requestId?: string;
  }) {
    super(options.message);
    this.name = 'ApiClientError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
    this.requestId = options.requestId;
  }
}

export class RateLimitError extends ApiClientError {
  retryAfter: number | null;

  constructor(options: {
    message: string;
    code: string;
    statusCode: number;
    retryAfter: number | null;
    requestId?: string;
  }) {
    super({
      message: options.message,
      code: options.code,
      statusCode: options.statusCode,
      requestId: options.requestId,
    });
    this.name = 'RateLimitError';
    this.retryAfter = options.retryAfter;
  }
}
