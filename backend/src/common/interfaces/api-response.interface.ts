// Req 20: Standardized API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details: string[];
    timestamp: string;
    path: string;
  };
}
