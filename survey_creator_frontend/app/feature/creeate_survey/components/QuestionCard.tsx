"use client";

import type { Question } from "../types/question";
import DateTime from "./questionType/date-time";
import Likert from "./questionType/likert";
import LongText from "./questionType/long-text";
import Matrix from "./questionType/matrix";
import RatingScale10 from "./questionType/ratingScale10";
import RatingScale5 from "./questionType/ratingScale5";
import ShortText from "./questionType/short-text";
import Slider from "./questionType/slider";
import YesNo from "./questionType/yes-no";

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isDragged: boolean;
  isPreviewMode?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const questionTypeLabels: Record<string, string> = {
  "single-choice": "Single Choice",
  "multiple-choice": "Multiple Choice",
  checkbox: "Checkbox",
  "short-text": "Short Text",
  "long-text": "Long Text",
  "rating-scale-5": "Rating (1-5)",
  "rating-scale-10": "Rating (1-10)",
  nps: "NPS",
  likert: "Likert Scale",
  "image-choice": "Image Choice",
  matrix: "Matrix/Grid",
  "yes-no": "Yes/No",
  ranking: "Ranking",
  slider: "Slider",
  "date-time": "Date/Time",
};

export default function QuestionCard({
  question,
  isSelected,
  isDragged,
  isPreviewMode = false,
  onSelect,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragEnd,
}: QuestionCardProps) {
  const showActions = !isPreviewMode;

  return (
    <div
      draggable={!isPreviewMode}
      onDragStart={() => onDragStart(question.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(question.id)}
      className="group rounded-[24px] border p-5 shadow-[0_10px_32px_rgba(28,28,26,0.04)] transition-all cursor-grab active:cursor-grabbing"
      style={{
        backgroundColor: isSelected
          ? "rgba(124, 158, 138, 0.08)"
          : "rgba(250,247,242,0.96)",
        borderColor: isSelected ? "rgba(124, 158, 138, 0.55)" : "var(--border)",
        opacity: isDragged ? 0.5 : 1,
      }}
    >
      <div className="flex gap-4">
        {/* Drag Handle */}
        <div className="flex items-start pt-1 text-xl text-[var(--border)]">
          ≡
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
                Q{question.order + 1}
              </p>
              <h3 className="mt-2 text-[1.05rem] font-medium text-[var(--text)] wrap-break-word">
                {question.questionText}
                {question.required ? (
                  <span className="ml-1 text-[var(--accent)]">*</span>
                ) : null}
              </h3>
              {question.description ? (
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {question.description}
                </p>
              ) : null}
            </div>

            <div className="rounded-full border border-[rgba(124,158,138,0.22)] bg-[rgba(124,158,138,0.1)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
              {questionTypeLabels[question.questionType] ||
                question.questionType}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--border)] bg-white/70 px-4 py-4">
            <QuestionPreview question={question} />
          </div>
        </div>
      </div>

      {showActions ? (
        <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(question.id);
            }}
            className="rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[rgba(124,158,138,0.14)]"
          >
            Duplicate
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question.id);
            }}
            className="ml-auto rounded-full border border-[rgba(196,106,106,0.22)] bg-[rgba(196,106,106,0.08)] px-3 py-1.5 text-xs font-medium text-[#8f4c4c] transition-colors hover:bg-[rgba(196,106,106,0.14)]"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function QuestionPreview({ question }: { question: Question }) {
  switch (question.questionType) {
    case "single-choice":
    case "multiple-choice":
    case "checkbox":
    case "image-choice":
    case "ranking":
      return (
        <div className="space-y-3">
          {(question.options ?? []).map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-3 text-sm text-foreground"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] text-[10px] text-primary">
                {question.questionType === "checkbox"
                  ? "☐"
                  : question.questionType === "multiple-choice"
                    ? "●"
                    : index + 1}
              </span>
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      );

    case "rating-scale-5":
      return RatingScale5();

    case "rating-scale-10":
      return RatingScale10();

    case "likert":
      return Likert();

    case "short-text":
      return ShortText();

    case "long-text":
      return LongText();

    case "yes-no":
      return YesNo();

    case "slider":
      return Slider({
        minLabel: question.options?.[0]?.text,
        maxLabel: question.options?.[1]?.text,
      });

    case "matrix":
      return Matrix({
        rows: question.options ?? [],
        columns: question.matrixColumns ?? [],
      });

    case "date-time":
      return DateTime();

    default:
      return (
        <div className="text-sm text-[var(--muted)]">
          Preview unavailable for this element.
        </div>
      );
  }
}
