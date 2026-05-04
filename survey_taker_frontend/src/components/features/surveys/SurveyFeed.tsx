// src/components/features/surveys/SurveyFeed.tsx

import React, { useEffect, useRef } from "react";
import { useSurveyFeed } from "@/hooks/useSurveyFeed";
import { SurveyCard } from "@/components/features/surveys/SurveyCard";
import { SurveyFilters } from "@/components/features/surveys/SurveyFilters";
import type { Survey } from "@/types/survey";
// Placeholder auth hook – assumed to exist in the project
import { useAuth } from "@/hooks/useAuth";

export const SurveyFeed: React.FC = () => {
  const { user } = useAuth();
  const age = user?.profile?.age ?? 0;

  const filters = { rewardPointsMin: 0, rewardPointsMax: 200, duration: "", categories: [] };
  const query = useSurveyFeed(filters);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
          }
        });
      },
      { rootMargin: "200px" }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [query]);

  const allSurveys: Survey[] = query.data?.pages.flatMap((page) => page.surveys) ?? [];

  // Client‑side age filtering
  const visibleSurveys = allSurveys.filter((s) => s.ageRestriction === 0 || age >= s.ageRestriction);

  const handleFiltersChange = (newFilters: any) => {
    // Re‑run query with new filters – for simplicity, we could refetch manually
    // In a full implementation, filters would be a state variable used in useSurveyFeed.
  };

  return (
    <div className="flex flex-col gap-4">
      <SurveyFilters onChange={handleFiltersChange} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleSurveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>
      {query.isLoading && <p className="text-center text-[#6B6860]">Loading surveys...</p>}
      {/* Sentinel for infinite scrolling */}
      <div ref={loadMoreRef} />
    </div>
  );
};
