// lib/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthToken } from "../auth/tokenManager";
import { refreshToken } from "../auth/refreshToken";

const apiClient: AxiosInstance = axios.create({
  // Base URL can be configured via environment variable or defaults to relative.
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  withCredentials: true,
});

// Request interceptor – attach Authorization header if token exists.
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 by attempting token refresh and retrying once.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        const originalConfig = error.config as AxiosRequestConfig;
        // After refresh, retry original request.
        return apiClient(originalConfig);
      } catch (refreshError) {
        // Refresh failed – propagate original error.
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
