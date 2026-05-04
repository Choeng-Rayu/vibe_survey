// src/components/features/surveys/SurveyFilters.tsx

import React, { useState } from "react";

interface Filters {
  rewardPointsMin?: number;
  rewardPointsMax?: number;
  duration?: string;
  categories?: string[];
}

interface SurveyFiltersProps {
  onChange: (filters: Filters) => void;
}

export const SurveyFilters: React.FC<SurveyFiltersProps> = ({ onChange }) => {
  const [rewardMin, setRewardMin] = useState(0);
  const [rewardMax, setRewardMax] = useState(100);
  const [duration, setDuration] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["Health", "Travel", "Food", "Technology"]; // hard‑coded example

  const handleApply = () => {
    onChange({
      rewardPointsMin: rewardMin,
      rewardPointsMax: rewardMax,
      duration: duration || undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#F2EDE5] p-4">
      <div>
        <label className="block text-sm font-medium text-[#6B6860]">Reward Points</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={200}
            value={rewardMin}
            onChange={(e) => setRewardMin(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-[#6B6860]">{rewardMin}</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={200}
            value={rewardMax}
            onChange={(e) => setRewardMax(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-[#6B6860]">{rewardMax}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B6860]">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300 bg-white p-1"
        >
          <option value="">Any</option>
          <option value="short">Short (≤5min)</option>
          <option value="medium">Medium (5‑15min)</option>
          <option value="long">Long (>15min)</option>
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-[#6B6860]">Categories</span>
        <div className="mt-1 flex flex-wrap gap-2">
{categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={selectedCategories.includes(cat)
                ? "rounded-full bg-[#7C9E8A] text-white px-3 py-1 text-xs"
                : "rounded-full bg-[#FAF7F2] text-[#1C1C1A] px-3 py-1 text-xs"}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="self-start rounded-full bg-[#7C9E8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#6A8C78]"
      >
        Apply Filters
      </button>
    </div>
  );
};
