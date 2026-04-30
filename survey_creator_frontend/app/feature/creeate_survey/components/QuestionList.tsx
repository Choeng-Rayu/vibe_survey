"use client";

import type { Question } from "../types/question";
import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  draggedQuestionId: string | null;
  isPreviewMode?: boolean;
  onSelectQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (targetIndex: number) => void;
}

export default function QuestionList({
  questions,
  selectedQuestionId,
  draggedQuestionId,
  isPreviewMode = false,
  onSelectQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onDragStart,
  onDragEnd,
  onDrop,
}: QuestionListProps) {
  const handleDragOver = (e: React.DragEvent) => {
    if (isPreviewMode) {
      return;
    }

    e.preventDefault();
  };

  const handleDropAtIndex = (index: number) => {
    onDrop(index);
  };

  return (
    <div className="space-y-5">
      {questions.map((question, index) => (
        <div key={question.id}>
          {/* Drop Zone Before Question */}
          <div
            className={`h-2 rounded-full transition-all ${
              isPreviewMode ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundColor:
                draggedQuestionId === question.id
                  ? "rgba(124, 158, 138, 0.5)"
                  : "transparent",
            }}
            onDragOver={handleDragOver}
            onDrop={() => handleDropAtIndex(index)}
          />

          {/* Question Card */}
          <QuestionCard
            question={question}
            isSelected={selectedQuestionId === question.id}
            isDragged={draggedQuestionId === question.id}
            isPreviewMode={isPreviewMode}
            onSelect={onSelectQuestion}
            onDelete={onDeleteQuestion}
            onDuplicate={onDuplicateQuestion}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </div>
      ))}

      {/* Drop Zone At End */}
      {questions.length > 0 && (
        <div
          className={`h-2 rounded-full transition-all ${
            isPreviewMode ? "opacity-0" : "opacity-100"
          }`}
          onDragOver={handleDragOver}
          onDrop={() => handleDropAtIndex(questions.length)}
        />
      )}
    </div>
  );
}
