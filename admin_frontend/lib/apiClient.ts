import {
  ApiResponse,
  ApiErrorResponse,
  ApiClientError,
  RateLimitError,
  QueryParams,
} from './apiTypes';

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000') + '/api/v1';
const IS_DEV = process.env.NODE_ENV === 'development';
const MAX_RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY = 1000;
const BACKOFF_MULTIPLIER = 2;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function maskAuthHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  const masked = { ...headers };
  if (masked['Authorization']) {
    masked['Authorization'] = 'Bearer ****';
  }
  if (masked['Cookie']) {
    masked['Cookie'] = '****';
  }
  return masked;
}

function logRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
): void {
  if (!IS_DEV) return;
  console.debug(`[API →] ${method} ${url}`, {
    headers: maskAuthHeaders(headers),
  });
}

function logResponse(
  method: string,
  url: string,
  status: number,
  duration: number,
  data: unknown,
): void {
  if (!IS_DEV) return;
  const dataShape = Array.isArray(data)
    ? `Array(${data.length})`
    : typeof data === 'object' && data !== null
      ? `Object{${Object.keys(data as Record<string, unknown>).join(',')}}`
      : typeof data;
  console.debug(`[API ←] ${method} ${url} ${status} ${duration}ms`, {
    dataShape,
  });
}

function logError(
  method: string,
  url: string,
  error: unknown,
  duration: number,
): void {
  if (!IS_DEV) return;
  console.debug(`[API ✗] ${method} ${url} ${duration}ms`, error);
}

function buildQueryString(params?: QueryParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      const serialized = Array.isArray(value) ? value.join(',') : value;
      searchParams.set(`filter[${key}]`, serialized);
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

async function parseErrorEnvelope(
  response: Response,
): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {
      success: false,
      error: {
        code: `${response.status}`,
        message: response.statusText,
        timestamp: new Date().toISOString(),
      },
      meta: { requestId: response.headers.get('x-request-id') ?? '' },
    };
  }
}

function throwErrorFromEnvelope(
  envelope: ApiErrorResponse,
  statusCode: number,
): never {
  throw new ApiClientError({
    message: envelope.error.message,
    code: envelope.error.code,
    statusCode,
    details: envelope.error.details,
    requestId: envelope.meta.requestId,
  });
}

async function handleRateLimit(response: Response): Promise<never> {
  const envelope = await parseErrorEnvelope(response);
  const retryAfterHeader = response.headers.get('Retry-After');
  let retryAfter: number | null = null;

  if (retryAfterHeader) {
    const parsed = Number(retryAfterHeader);
    if (!Number.isNaN(parsed)) {
      retryAfter = parsed;
    }
  }

  throw new RateLimitError({
    message: envelope.error.message,
    code: envelope.error.code,
    statusCode: 429,
    retryAfter,
    requestId: envelope.meta.requestId,
  });
}

async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: unknown;
  params?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  retryAttempt?: number;
};

async function request<T>(options: RequestOptions): Promise<T> {
  const {
    method,
    url,
    body,
    params,
    headers: extraHeaders,
    signal,
    retryAttempt = 0,
  } = options;

  const requestId = generateRequestId();
  const fullUrl = `${BASE_URL}${url}${buildQueryString(params)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
    ...extraHeaders,
  };

  logRequest(method, fullUrl, headers);

  const startTime = Date.now();

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(method, fullUrl, error, duration);

    if (
      method === 'GET' &&
      retryAttempt < MAX_RETRY_ATTEMPTS &&
      error instanceof TypeError
    ) {
      const delay = INITIAL_RETRY_DELAY * BACKOFF_MULTIPLIER ** retryAttempt;
      await sleep(delay);
      return request<T>({ ...options, retryAttempt: retryAttempt + 1 });
    }

    throw new ApiClientError({
      message: error instanceof Error ? error.message : 'Network error',
      code: 'NETWORK_ERROR',
      statusCode: 0,
      requestId,
    });
  }

  const duration = Date.now() - startTime;

  if (response.status === 429) {
    logError(method, fullUrl, 'Rate limited', duration);
    await handleRateLimit(response);
  }

  if (response.status === 401) {
    if (!url.startsWith('/auth/')) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        return request<T>({ ...options, retryAttempt });
      }
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw new ApiClientError({
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
      statusCode: 401,
      requestId,
    });
  }

  if (response.status === 403) {
    const envelope = await parseErrorEnvelope(response);
    logError(method, fullUrl, envelope.error, duration);
    throwErrorFromEnvelope(envelope, 403);
  }

  if (response.status >= 500) {
    const envelope = await parseErrorEnvelope(response);
    logError(method, fullUrl, envelope.error, duration);

    if (method === 'GET' && retryAttempt < MAX_RETRY_ATTEMPTS) {
      const delay = INITIAL_RETRY_DELAY * BACKOFF_MULTIPLIER ** retryAttempt;
      await sleep(delay);
      return request<T>({ ...options, retryAttempt: retryAttempt + 1 });
    }

    throwErrorFromEnvelope(envelope, response.status);
  }

  if (!response.ok) {
    const envelope = await parseErrorEnvelope(response);
    logError(method, fullUrl, envelope.error, duration);
    throwErrorFromEnvelope(envelope, response.status);
  }

  if (response.status === 204) {
    logResponse(method, fullUrl, 204, duration, null);
    return undefined as T;
  }

  const json = (await response.json()) as ApiResponse<T>;
  logResponse(method, fullUrl, response.status, duration, json.data);
  return json.data;
}

export const apiClient = {
  get<T>(url: string, params?: QueryParams, signal?: AbortSignal): Promise<T> {
    return request<T>({ method: 'GET', url, params, signal });
  },

  post<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<T> {
    return request<T>({ method: 'POST', url, body, headers, signal });
  },

  put<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<T> {
    return request<T>({ method: 'PUT', url, body, headers, signal });
  },

  patch<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<T> {
    return request<T>({ method: 'PATCH', url, body, headers, signal });
  },

  delete<T>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<T> {
    return request<T>({ method: 'DELETE', url, headers, signal });
  },
};
