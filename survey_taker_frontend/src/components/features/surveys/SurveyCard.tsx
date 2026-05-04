// src/components/features/surveys/SurveyCard.tsx

import React from "react";
import type { Survey } from "@/types/survey";

interface SurveyCardProps {
  survey: Survey;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
  const { title, estimatedTime, rewardPoints, matchScore } = survey;
  const highMatch = matchScore > 80;

  return (
    <div className="rounded-lg border border-gray-200 bg-[#F2EDE5] p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[#1C1C1A]">{title}</h3>
      <div className="mt-2 text-sm text-[#6B6860]">
        <p>Estimated time: {estimatedTime} min</p>
        <p>Reward: {rewardPoints} pts</p>
        <p>Match score: {matchScore}%</p>
      </div>
      {highMatch && (
        <span className="mt-2 inline-block rounded-full bg-[#C4956A] px-3 py-1 text-xs font-medium text-white">
          High Match
        </span>
      )}
    </div>
  );
};
