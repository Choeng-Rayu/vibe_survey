// src/components/features/profile/InterestsSelector.tsx
"use client";

import React, { useState } from "react";

interface InterestsSelectorProps {
  selected?: string[];
  onChange?: (selected: string[]) => void;
}

const INTERESTS = [
  "Sports",
  "Technology",
  "Music",
  "Travel",
  "Food",
  "Health",
  "Fashion",
  "Gaming",
  "Art",
  "Science",
];

export default function InterestsSelector({ selected = [], onChange }: InterestsSelectorProps) {
  const [chosen, setChosen] = useState<string[]>(selected);

  const toggleInterest = (interest: string) => {
    let newChosen: string[];
    if (chosen.includes(interest)) {
      newChosen = chosen.filter((i) => i !== interest);
    } else {
      if (chosen.length >= 10) return; // limit 10
      newChosen = [...chosen, interest];
    }
    setChosen(newChosen);
    onChange?.(newChosen);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {INTERESTS.map((interest) => {
        const isSelected = chosen.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-3 py-1 rounded-full border ${isSelected ? "bg-primary text-white" : "bg-surface text-text"}`}
          >
            {interest}
          </button>
        );
      })}
    </div>
  );
}
