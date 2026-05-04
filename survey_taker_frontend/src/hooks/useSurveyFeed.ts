// src/hooks/useSurveyFeed.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Survey } from "@/types/survey";
import { fetchSurveys, type FetchSurveysParams } from "@/lib/api/surveys";

/**
 * Hook to fetch an infinite list of surveys with optional filters.
 *
 * @param filters Object containing filter criteria (except pagination).
 * @returns The TanStack Query result object.
 */
export function useSurveyFeed(filters: Omit<FetchSurveysParams, "page">) {
  return useInfiniteQuery<
    { surveys: Survey[]; nextPage: number | null },
    Error,
    { surveys: Survey[]; nextPage: number | null },
    number
  >({
    queryKey: ["surveys", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params: FetchSurveysParams = { ...filters, page: pageParam };
      return fetchSurveys(params);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
