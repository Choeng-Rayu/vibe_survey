export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "checkbox"
  | "short-text"
  | "long-text"
  | "rating-scale-5"
  | "rating-scale-10"
  | "nps"
  | "likert"
  | "image-choice"
  | "matrix"
  | "yes-no"
  | "ranking"
  | "slider"
  | "date-time";

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  order: number;
  questionText: string;
  questionType: QuestionType;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  randomizeOptions?: boolean;
  randomizeQuestionOrder?: boolean;
  charLimit?: number;
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
  matrixRows?: string[];
  matrixColumns?: string[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
  logic?: LogicRule[];
}

export interface LogicRule {
  id: string;
  condition: "equals" | "not-equals" | "contains" | "greater-than" | "less-than";
  answerValue: string | number;
  action: "skip-to" | "show" | "hide";
  targetQuestionId?: string;
  targetQuestionOrder?: number;
}

