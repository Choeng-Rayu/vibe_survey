import { QueryClient } from '@tanstack/react-query';
import { ApiClientError } from './apiTypes';

function isServerError(error: unknown): boolean {
  return error instanceof ApiClientError && error.statusCode >= 500;
}

let queryClient: QueryClient | undefined;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (
            error instanceof ApiClientError &&
            (error.statusCode === 401 || error.statusCode === 403)
          ) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: undefined,
  });
}

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  if (!queryClient) {
    queryClient = makeQueryClient();
  }

  return queryClient;
}
