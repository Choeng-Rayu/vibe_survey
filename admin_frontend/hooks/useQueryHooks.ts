import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import {
  PaginatedResponse,
  QueryParams,
  ApiClientError,
} from '@/lib/apiTypes';

export function usePaginatedQuery<T>(
  key: string[],
  url: string,
  params?: QueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<T>, ApiClientError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<PaginatedResponse<T>, ApiClientError>({
    queryKey: [...key, params],
    queryFn: ({ signal }) =>
      apiClient.get<PaginatedResponse<T>>(url, params, signal),
    ...options,
  });
}

export function useItemQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, ApiClientError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, ApiClientError>({
    queryKey: key,
    queryFn: ({ signal }) => apiClient.get<T>(url, undefined, signal),
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  urlOrBuilder: string | ((vars: TVariables) => string),
  options?: Omit<
    UseMutationOptions<TData, ApiClientError, TVariables>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiClientError, TVariables>({
    mutationFn: (variables: TVariables) => {
      const resolvedUrl =
        typeof urlOrBuilder === 'function'
          ? urlOrBuilder(variables)
          : urlOrBuilder;

      switch (method) {
        case 'POST':
          return apiClient.post<TData>(resolvedUrl, variables);
        case 'PUT':
          return apiClient.put<TData>(resolvedUrl, variables);
        case 'PATCH':
          return apiClient.patch<TData>(resolvedUrl, variables);
        case 'DELETE':
          return apiClient.delete<TData>(resolvedUrl);
      }
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries();
      return options?.onSuccess?.(...args);
    },
  });
}
