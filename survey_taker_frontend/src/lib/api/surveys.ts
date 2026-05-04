// src/lib/api/surveys.ts

import type { Survey } from "@/types/survey";

export interface FetchSurveysParams {
  rewardPointsMin?: number;
  rewardPointsMax?: number;
  duration?: string; // e.g., "short", "medium", "long"
  categories?: string[];
  age?: number;
  page: number;
}

/**
 * Simulated API call returning mock surveys.
 * In a real implementation this would call `/api/v1/surveys/feed`.
 */
export async function fetchSurveys(
  params: FetchSurveysParams
): Promise<{ surveys: Survey[]; nextPage: number | null }> {
  // Mock data – a few example surveys
  const mockSurveys: Survey[] = [
    {
      id: "s1",
      title: "Consumer Habits Survey",
      estimatedTime: 5,
      rewardPoints: 50,
      matchScore: 92,
      ageRestriction: 18,
    },
    {
      id: "s2",
      title: "Travel Preferences",
      estimatedTime: 8,
      rewardPoints: 70,
      matchScore: 76,
      ageRestriction: 21,
    },
    {
      id: "s3",
      title: "Local Food Trends",
      estimatedTime: 3,
      rewardPoints: 30,
      matchScore: 85,
      ageRestriction: 0,
    },
  ];

  // Simple pagination simulation – only two pages of data
  const pageSize = 2;
  const start = (params.page - 1) * pageSize;
  const pageSurveys = mockSurveys.slice(start, start + pageSize);
  const nextPage = start + pageSize < mockSurveys.length ? params.page + 1 : null;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { surveys: pageSurveys, nextPage };
}
