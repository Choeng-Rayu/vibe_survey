// src/components/features/profile/CompletenessBar.tsx
"use client";

import React from "react";

interface CompletenessBarProps {
  percentage: number;
}

export default function CompletenessBar({ percentage }: CompletenessBarProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-surface rounded-full h-4 overflow-hidden">
        <div
          className="bg-primary h-full"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-text">{safePercentage}%</span>
    </div>
  );
}
