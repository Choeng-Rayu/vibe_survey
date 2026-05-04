// src/types/survey.ts

export interface Survey {
  id: string;
  title: string;
  estimatedTime: number; // minutes
  rewardPoints: number;
  matchScore: number; // 0-100
  ageRestriction: number; // minimum age, 0 if none
}
