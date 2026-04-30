import type { Question } from "./question";

export type SurveyStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type CampaignObjective =
  | "brand-awareness"
  | "product-feedback"
  | "market-research"
  | "customer-satisfaction";

export interface Screener {
  id: string;
  questions: Question[];
  qualifyingAnswers: Record<string, string[]>;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  objective?: CampaignObjective;
  status: SurveyStatus;
  questions: Question[];
  screener?: Screener;
  estimatedCompletionTime?: number;
  estimatedQuestionsCount?: number;
  randomizeQuestionOrder?: boolean;
  attentionChecks?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  versionHistory?: SurveyVersion[];
}

export interface SurveyVersion {
  id: string;
  surveyId: string;
  version: number;
  snapshot: Survey;
  changes: string;
  aiAction?: string;
  aiMode?: "generate" | "modify" | "enhance" | "normalize" | "translate" | "analyze";
  timestamp: string;
}
