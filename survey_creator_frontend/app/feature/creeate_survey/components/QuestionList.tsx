"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Question } from "../types/question";
import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  isPreviewMode?: boolean;
  onSelectQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onUpdateQuestion?: (question: Question) => void;
  responses?: Record<string, unknown>;
  onResponseChange?: (questionId: string, value: unknown) => void;
}

export default function QuestionList({
  questions,
  selectedQuestionId,
  isPreviewMode = false,
  onSelectQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onUpdateQuestion,
  responses = {},
  onResponseChange,
}: QuestionListProps) {
  return (
    <SortableContext
      items={questions.map((q) => q.id)}
      strategy={verticalListSortingStrategy}
      disabled={isPreviewMode}
    >
      <div className="space-y-5">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isSelected={selectedQuestionId === question.id}
            isPreviewMode={isPreviewMode}
            onSelect={onSelectQuestion}
            onDelete={onDeleteQuestion}
            onDuplicate={onDuplicateQuestion}
            onUpdate={onUpdateQuestion}
            response={responses[question.id]}
            onResponseChange={onResponseChange}
          />
        ))}
      </div>
    </SortableContext>
  );
}
