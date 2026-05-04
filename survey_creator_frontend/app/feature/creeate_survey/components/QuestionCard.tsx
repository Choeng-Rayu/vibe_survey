"use client";

import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { generateId } from "@/app/utils/id-generator";
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
import { Captcha } from "./questionType/captcha";

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isPreviewMode?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate?: (question: Question) => void;
  response?: unknown;
  onResponseChange?: (questionId: string, value: unknown) => void;
}

const questionTypeLabels: Record<string, string> = {
  "single-choice": "Single Choice",
  "multiple-choice": "Multiple Choice",
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
  captcha: "reCAPTCHA",
};

export default function QuestionCard({
  question,
  isSelected,
  isPreviewMode = false,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  response,
  onResponseChange,
}: QuestionCardProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedText, setEditedText] = useState(question.questionText);
  const [editedDescription, setEditedDescription] = useState(
    question.description || "",
  );
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingOptionText, setEditingOptionText] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    disabled: isPreviewMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isSelected
      ? "rgba(124, 158, 138, 0.08)"
      : "rgba(250,247,242,0.96)",
    borderColor: isSelected ? "rgba(124, 158, 138, 0.55)" : "var(--border)",
    cursor: isPreviewMode ? "default" : "grab",
  };

  const showActions = !isPreviewMode;

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate({
        ...question,
        questionText: editedText,
        description: editedDescription || undefined,
      });
    }
    setIsEditingText(false);
  };

  const handleCancelEdit = () => {
    setEditedText(question.questionText);
    setEditedDescription(question.description || "");
    setIsEditingText(false);
  };

  const startOptionEdit = (optionId: string, optionText: string) => {
    if (isPreviewMode) {
      return;
    }

    setEditingOptionId(optionId);
    setEditingOptionText(optionText);
  };

  const saveOptionEdit = () => {
    if (!onUpdate || !editingOptionId) {
      return;
    }

    const nextOptions = (question.options ?? []).map((option) =>
      option.id === editingOptionId
        ? { ...option, text: editingOptionText.trim() || option.text }
        : option,
    );

    onUpdate({
      ...question,
      options: nextOptions,
    });

    setEditingOptionId(null);
    setEditingOptionText("");
  };

  const cancelOptionEdit = () => {
    setEditingOptionId(null);
    setEditingOptionText("");
  };

  const handleAddOption = () => {
    if (!onUpdate) {
      return;
    }

    const newOption = {
      id: generateId(),
      text: `Option ${(question.options?.length || 0) + 1}`,
      imageUrl: question.questionType === "image-choice" ? "" : undefined,
    };

    onUpdate({
      ...question,
      options: [...(question.options || []), newOption],
    });
  };

  const handleUpdateOptionImage = (optionId: string, imageUrl: string) => {
    if (!onUpdate) {
      return;
    }

    const nextOptions = (question.options ?? []).map((option) =>
      option.id === optionId ? { ...option, imageUrl } : option,
    );

    onUpdate({
      ...question,
      options: nextOptions,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(question.id)}
      className={`group rounded-[24px] border p-5 shadow-[0_10px_32px_rgba(28,28,26,0.04)] transition-all ${
        !isPreviewMode ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Drag Handle */}
        {!isPreviewMode && (
          <div
            {...attributes}
            {...listeners}
            className="flex items-start pt-1 text-xl text-[var(--border)] touch-none"
          >
            ≡
          </div>
        )}

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
                Q{question.order + 1}
              </p>

              {isEditingText && !isPreviewMode ? (
                <div className="mt-2 space-y-3">
                  <div>
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full border border-[rgba(124,158,138,0.3)] rounded-lg bg-white px-3 py-2 text-[1.05rem] font-medium text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
                      placeholder="Question text"
                      autoFocus
                    />
                  </div>
                  <div>
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={2}
                      className="w-full border border-[rgba(124,158,138,0.3)] rounded-lg bg-white px-3 py-2 text-sm text-[var(--muted)] outline-none transition-colors focus:border-[var(--primary)] resize-none"
                      placeholder="Optional description or help text"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="rounded-lg border border-[var(--primary)] bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-[rgba(124,158,138,0.3)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[rgba(124,158,138,0.05)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className="mt-2 text-[1.05rem] font-medium text-[var(--text)] wrap-break-word cursor-text hover:opacity-75 transition-opacity"
                    onClick={() =>
                      !isPreviewMode && onUpdate && setIsEditingText(true)
                    }
                    title={!isPreviewMode ? "Click to edit" : ""}
                  >
                    {question.questionText}
                    {question.required ? (
                      <span className="ml-1 text-[var(--accent)]">*</span>
                    ) : null}
                  </h3>
                  {question.description ? (
                    <p
                      className="mt-2 text-sm leading-6 text-[var(--muted)] cursor-text hover:opacity-75 transition-opacity"
                      onClick={() =>
                        !isPreviewMode && onUpdate && setIsEditingText(true)
                      }
                      title={!isPreviewMode ? "Click to edit" : ""}
                    >
                      {question.description}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div className="rounded-full border border-[rgba(124,158,138,0.22)] bg-[rgba(124,158,138,0.1)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
              {questionTypeLabels[question.questionType] ||
                question.questionType}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--border)] bg-white/70 px-4 py-4">
            <QuestionPreview
              question={question}
              isPreviewMode={isPreviewMode}
              response={response}
              onResponseChange={onResponseChange}
              editingOptionId={editingOptionId}
              editingOptionText={editingOptionText}
              onStartOptionEdit={startOptionEdit}
              onEditingOptionTextChange={setEditingOptionText}
              onSaveOptionEdit={saveOptionEdit}
              onCancelOptionEdit={cancelOptionEdit}
              onAddOption={handleAddOption}
              onUploadOptionImage={handleUpdateOptionImage}
            />
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

interface ImageChoiceBuilderProps {
  options: Array<{ id: string; text: string; imageUrl?: string }>;
  editingOptionId?: string | null;
  editingOptionText?: string;
  isPreviewMode?: boolean;
  onStartOptionEdit?: (optionId: string, optionText: string) => void;
  onEditingOptionTextChange?: (value: string) => void;
  onSaveOptionEdit?: () => void;
  onCancelOptionEdit?: () => void;
  onAddOption?: () => void;
  onUploadOptionImage?: (optionId: string, imageUrl: string) => void;
}

function ImageChoiceBuilder({
  options,
  editingOptionId,
  editingOptionText = "",
  isPreviewMode,
  onStartOptionEdit,
  onEditingOptionTextChange,
  onSaveOptionEdit,
  onCancelOptionEdit,
  onAddOption,
  onUploadOptionImage,
}: ImageChoiceBuilderProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (optionId: string) => {
    const input = fileInputRefs.current[optionId];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUploadOptionImage?.(optionId, reader.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={option.id}>
          {editingOptionId === option.id ? (
            <div className="flex flex-col gap-3 rounded-lg border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.05)] p-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-primary">{index + 1}</span>
                <input
                  type="text"
                  value={editingOptionText || ""}
                  autoFocus
                  onChange={(e) => onEditingOptionTextChange?.(e.target.value)}
                  onBlur={() => onSaveOptionEdit?.()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSaveOptionEdit?.();
                    }
                    if (e.key === "Escape") {
                      onCancelOptionEdit?.();
                    }
                  }}
                  className="flex-1 rounded-md border border-[rgba(124,158,138,0.24)] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Option label (optional)"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFileSelect(option.id)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-[rgba(124,158,138,0.14)]"
                >
                  <span>📷 Upload image</span>
                </button>
                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current[option.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(option.id, e)}
                />
                {option.imageUrl ? (
                  <>
                    <span className="text-xs text-muted">✓ Image attached</span>
                    <button
                      type="button"
                      onClick={() => onUploadOptionImage?.(option.id, "")}
                      className="text-xs text-[#8f4c4c] hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                ) : null}
              </div>
              {option.imageUrl && (
                <div className="mt-2">
                  <div className="relative inline-block h-16 w-16 overflow-hidden rounded-md border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)]">
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-start gap-3 rounded-lg border border-[rgba(124,158,138,0.2)] bg-white p-3 text-sm transition-all hover:border-primary hover:bg-[rgba(124,158,138,0.02)]"
              onDoubleClick={() => onStartOptionEdit?.(option.id, option.text)}
              title={isPreviewMode ? undefined : "Double-click to edit option"}
            >
              <span className="pt-0.5 text-lg font-medium text-primary shrink-0">{index + 1}</span>
              <div className="flex-1 min-w-0">
                {option.imageUrl && (
                  <div className="mb-2 relative inline-block h-12 w-12 overflow-hidden rounded-md border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)]">
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span className="block">{option.text}</span>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddOption?.()}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-[rgba(124,158,138,0.14)]"
      >
        + Add option
      </button>
    </div>
  );
}

function QuestionPreview({
  question,
  isPreviewMode,
  response,
  onResponseChange,
  editingOptionId,
  editingOptionText,
  onStartOptionEdit,
  onEditingOptionTextChange,
  onSaveOptionEdit,
  onCancelOptionEdit,
  onAddOption,
  onUploadOptionImage,
}: {
  question: Question;
  isPreviewMode?: boolean;
  response?: unknown;
  onResponseChange?: (questionId: string, value: unknown) => void;
  editingOptionId?: string | null;
  editingOptionText?: string;
  onStartOptionEdit?: (optionId: string, optionText: string) => void;
  onEditingOptionTextChange?: (value: string) => void;
  onSaveOptionEdit?: () => void;
  onCancelOptionEdit?: () => void;
  onAddOption?: () => void;
  onUploadOptionImage?: (optionId: string, imageUrl: string) => void;
}) {
  const handleChange = (value: unknown) => {
    if (onResponseChange) {
      onResponseChange(question.id, value);
    }
  };
  switch (question.questionType) {
    case "single-choice":
      if (isPreviewMode) {
        return (
          <div className="space-y-3">
            {(question.options ?? []).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChange(option.id)}
                className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-all ${
                  response === option.id
                    ? "border-[var(--primary)] bg-[rgba(124,158,138,0.1)] text-[var(--text)]"
                    : "border-[rgba(124,158,138,0.24)] bg-white text-[var(--text)] hover:border-[var(--primary)]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full border-2 ${
                    response === option.id
                      ? "border-[var(--primary)] bg-[var(--primary)]"
                      : "border-[rgba(124,158,138,0.32)]"
                  }`}
                />
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {(question.options ?? []).map((option, index) => (
            editingOptionId === option.id ? (
              <div key={option.id} className="flex items-center gap-3 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] text-[10px] text-primary">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={editingOptionText || ""}
                  autoFocus
                  onChange={(e) => onEditingOptionTextChange?.(e.target.value)}
                  onBlur={() => onSaveOptionEdit?.()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSaveOptionEdit?.();
                    }
                    if (e.key === "Escape") {
                      onCancelOptionEdit?.();
                    }
                  }}
                  className="flex-1 rounded-md border border-[rgba(124,158,138,0.24)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
                />
              </div>
            ) : (
              <div
                key={option.id}
                className="flex items-center gap-3 text-sm text-foreground"
                onDoubleClick={() => onStartOptionEdit?.(option.id, option.text)}
                title={isPreviewMode ? undefined : "Double-click to edit option"}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] text-[10px] text-primary">
                  {index + 1}
                </span>
                <span>{option.text}</span>
              </div>
            )
          ))}
          {!isPreviewMode && onAddOption ? (
            <button
              type="button"
              onClick={onAddOption}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[rgba(124,158,138,0.14)]"
            >
              + Add option
            </button>
          ) : null}
        </div>
      );

    case "multiple-choice":
      if (isPreviewMode) {
        const selectedArray = Array.isArray(response) ? response : [];
        return (
          <div className="space-y-3">
            {(question.options ?? []).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  const newArray = selectedArray.includes(option.id)
                    ? selectedArray.filter((id) => id !== option.id)
                    : [...selectedArray, option.id];
                  handleChange(newArray);
                }}
                className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-all ${
                  selectedArray.includes(option.id)
                    ? "border-[var(--primary)] bg-[rgba(124,158,138,0.1)] text-[var(--text)]"
                    : "border-[rgba(124,158,138,0.24)] bg-white text-[var(--text)] hover:border-[var(--primary)]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded ${
                    selectedArray.includes(option.id)
                      ? "border-2 border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-2 border-[rgba(124,158,138,0.32)]"
                  } grid place-items-center text-xs`}
                >
                  {selectedArray.includes(option.id) && "✓"}
                </span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {(question.options ?? []).map((option) => (
            editingOptionId === option.id ? (
              <div key={option.id} className="flex items-center gap-3 text-sm">
                <span className="relative grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] bg-[rgba(124,158,138,0.08)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                </span>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editingOptionText || ""}
                    autoFocus
                    onChange={(e) => onEditingOptionTextChange?.(e.target.value)}
                    onBlur={() => onSaveOptionEdit?.()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSaveOptionEdit?.();
                      }
                      if (e.key === "Escape") {
                        onCancelOptionEdit?.();
                      }
                    }}
                    className="w-full rounded-md border border-[rgba(124,158,138,0.24)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[rgba(124,158,138,0.14)]">
                      <span>Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file || !onUploadOptionImage) {
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              onUploadOptionImage(option.id, reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {option.imageUrl ? (
                      <span className="text-xs text-[var(--muted)]">
                        Image attached
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={option.id}
                className="flex items-center gap-3 text-sm text-foreground"
                onDoubleClick={() => onStartOptionEdit?.(option.id, option.text)}
                title={isPreviewMode ? undefined : "Double-click to edit option"}
              >
                <span className="relative grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] bg-[rgba(124,158,138,0.08)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                </span>
                {option.imageUrl ? (
                  <span className="block h-8 w-8 overflow-hidden rounded-md border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)]">
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : null}
                <span>{option.text}</span>
              </div>
            )
          ))}
          {!isPreviewMode && onAddOption ? (
            <button
              type="button"
              onClick={onAddOption}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[rgba(124,158,138,0.14)]"
            >
              + Add option
            </button>
          ) : null}
        </div>
      );

    case "rating-scale-5":
      if (isPreviewMode) {
        const selectedRating = typeof response === "number" ? response : 0;

        return (
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange(value)}
                aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                className="grid h-12 w-12 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
              >
                <span
                  className={`text-3xl leading-none transition-colors ${
                    selectedRating >= value
                      ? "text-[var(--accent)]"
                      : "text-[rgba(124,158,138,0.22)]"
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        );
      }
      return RatingScale5();

    case "rating-scale-10":
      if (isPreviewMode) {
        return (
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange(value)}
                className={`rounded-lg border-2 px-2 py-1 text-xs font-medium transition-all ${
                  response === value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[rgba(124,158,138,0.32)] bg-white text-[var(--text)] hover:border-[var(--primary)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        );
      }
      return RatingScale10();

    case "likert":
      if (isPreviewMode) {
        const options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        return (
          <div className="flex justify-center gap-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChange(index)}
                className={`flex-1 rounded-lg border-2 py-2 text-xs font-medium transition-all ${
                  response === index
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[rgba(124,158,138,0.32)] bg-white text-[var(--text)] hover:border-[var(--primary)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      }
      return Likert();

    case "slider":
      if (isPreviewMode) {
        const min = question.minValue ?? 0;
        const max = question.maxValue ?? 100;
        const current = (response as number) || min;
        const percentage = ((current - min) / (max - min)) * 100;
        
        return (
          <div className="space-y-4">
            <div className="relative pt-2 pb-2">
              {/* Track background */}
              <div className="absolute inset-y-0 left-0 h-2 w-full rounded-full bg-[rgba(124,158,138,0.15)] top-1/2 -translate-y-1/2" />
              
              {/* Filled track */}
              <div 
                className="absolute h-2 rounded-full bg-primary top-1/2 -translate-y-1/2"
                style={{ width: `${percentage}%` }}
              />
              
              {/* Input */}
              <input
                type="range"
                min={min}
                max={max}
                value={current}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="relative z-10 w-full appearance-none rounded-full bg-transparent outline-none"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  height: "24px",
                }}
              />
              
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  -webkit-appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #7C9E8A;
                  border: 3px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(28, 28, 26, 0.15);
                  transition: all 0.2s ease;
                  margin-top: -11px;
                }
                
                input[type="range"]::-webkit-slider-thumb:hover {
                  box-shadow: 0 4px 12px rgba(28, 28, 26, 0.2);
                  transform: scale(1.15);
                }
                
                input[type="range"]::-webkit-slider-thumb:active {
                  transform: scale(1.1);
                }
                
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #7C9E8A;
                  border: 3px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(28, 28, 26, 0.15);
                  transition: all 0.2s ease;
                  margin-top: -11px;
                }
                
                input[type="range"]::-moz-range-thumb:hover {
                  box-shadow: 0 4px 12px rgba(28, 28, 26, 0.2);
                  transform: scale(1.15);
                }
                
                input[type="range"]::-moz-range-thumb:active {
                  transform: scale(1.1);
                }
              `}</style>
            </div>
            
            <div className="flex justify-between text-xs text-muted">
              <span>{question.minLabel || min}</span>
              <span className="font-medium text-foreground">{current}</span>
              <span>{question.maxLabel || max}</span>
            </div>
          </div>
        );
      }
      return Slider({
        minLabel: question.options?.[0]?.text,
        maxLabel: question.options?.[1]?.text,
      });

    case "date-time":
      if (isPreviewMode) {
        return (
          <input
            type="datetime-local"
            value={(response as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="h-12 w-full rounded-lg border border-[rgba(124,158,138,0.24)] bg-white px-4 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        );
      }
      return DateTime();

    case "matrix":
      if (isPreviewMode) {
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.05)] px-3 py-2 text-xs font-medium text-[var(--text)]" />
                  {(question.matrixColumns ?? []).map((col) => (
                    <th
                      key={col}
                      className="border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.05)] px-3 py-2 text-xs font-medium text-[var(--text)]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(question.matrixRows ?? []).map((row) => (
                  <tr key={row}>
                    <td className="border border-[rgba(124,158,138,0.2)] px-3 py-2 text-sm font-medium text-[var(--text)]">
                      {row}
                    </td>
                    {(question.matrixColumns ?? []).map((col) => (
                      <td
                        key={col}
                        className="border border-[rgba(124,158,138,0.2)] px-3 py-2 text-center"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              JSON.stringify({ row, column: col }),
                            )
                          }
                          className={`h-5 w-5 rounded-full border-2 transition-all ${
                            JSON.stringify({ row, column: col }) === response
                              ? "border-[var(--primary)] bg-[var(--primary)]"
                              : "border-[rgba(124,158,138,0.32)] hover:border-[var(--primary)]"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return Matrix({
        rows: question.options ?? [],
        columns: question.matrixColumns ?? [],
      });

    case "image-choice":
      if (isPreviewMode) {
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {(question.options ?? []).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChange(option.id)}
                className={`overflow-hidden rounded-lg border-2 transition-all ${
                  response === option.id
                    ? "border-[var(--primary)]"
                    : "border-[rgba(124,158,138,0.24)] hover:border-[var(--primary)]"
                }`}
              >
                <div className="relative w-full bg-[rgba(124,158,138,0.1)] pb-[100%]">
                  {option.imageUrl && (
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="px-3 py-2 text-sm font-medium text-[var(--text)]">
                  {option.text}
                </div>
              </button>
            ))}
          </div>
        );
      }
      return (
        <ImageChoiceBuilder
          options={question.options ?? []}
          editingOptionId={editingOptionId}
          editingOptionText={editingOptionText}
          isPreviewMode={isPreviewMode}
          onStartOptionEdit={onStartOptionEdit}
          onEditingOptionTextChange={onEditingOptionTextChange}
          onSaveOptionEdit={onSaveOptionEdit}
          onCancelOptionEdit={onCancelOptionEdit}
          onAddOption={onAddOption}
          onUploadOptionImage={onUploadOptionImage}
        />
      );

    case "ranking":
      if (isPreviewMode) {
        const selectedArray = Array.isArray(response) ? response : [];
        const remaining = (question.options ?? []).filter(
          (opt) => !selectedArray.includes(opt.id),
        );
        return (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-[var(--muted)]">
                Your ranking
              </p>
              <div className="space-y-2">
                {selectedArray.length > 0 ? (
                  selectedArray.map((id, index) => {
                    const option = (question.options ?? []).find(
                      (o) => o.id === id,
                    );
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 rounded-lg bg-[rgba(124,158,138,0.1)] px-3 py-2"
                      >
                        <span className="font-medium text-[var(--primary)]">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-sm">{option?.text}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newArray = selectedArray.filter(
                              (item) => item !== id,
                            );
                            handleChange(newArray);
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[var(--muted)]">
                    No items ranked yet
                  </p>
                )}
              </div>
            </div>
            {remaining.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-[var(--muted)]">
                  Available options
                </p>
                <div className="space-y-2">
                  {remaining.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChange([...selectedArray, option.id])}
                      className="flex w-full items-center gap-3 rounded-lg border border-[rgba(124,158,138,0.24)] bg-white px-3 py-2 text-sm hover:border-[var(--primary)]"
                    >
                      <span>+</span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {(question.options ?? []).map((option, index) => (
            editingOptionId === option.id ? (
              <div key={option.id} className="flex items-center gap-3 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] text-[10px] text-primary">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={editingOptionText || ""}
                  autoFocus
                  onChange={(e) => onEditingOptionTextChange?.(e.target.value)}
                  onBlur={() => onSaveOptionEdit?.()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSaveOptionEdit?.();
                    }
                    if (e.key === "Escape") {
                      onCancelOptionEdit?.();
                    }
                  }}
                  className="flex-1 rounded-md border border-[rgba(124,158,138,0.24)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
                />
              </div>
            ) : (
              <div
                key={option.id}
                className="flex items-center gap-3 text-sm text-foreground"
                onDoubleClick={() => onStartOptionEdit?.(option.id, option.text)}
                title={isPreviewMode ? undefined : "Double-click to edit option"}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[rgba(124,158,138,0.32)] text-[10px] text-primary">
                  {index + 1}
                </span>
                <span>{option.text}</span>
              </div>
            )
          ))}
          {!isPreviewMode && onAddOption ? (
            <button
              type="button"
              onClick={onAddOption}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(124,158,138,0.2)] bg-[rgba(124,158,138,0.08)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[rgba(124,158,138,0.14)]"
            >
              + Add option
            </button>
          ) : null}
        </div>
      );
      if (isPreviewMode) {
        return (
          <input
            type="text"
            value={(response as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your answer here"
            className="h-12 w-full rounded-full border border-[rgba(124,158,138,0.24)] bg-white px-4 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        );
      }
      return ShortText();

    case "long-text":
      if (isPreviewMode) {
        return (
          <textarea
            value={(response as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your detailed answer here"
            rows={4}
            className="w-full rounded-2xl border border-[rgba(124,158,138,0.24)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] resize-none"
          />
        );
      }
      return LongText();

    case "yes-no":
      if (isPreviewMode) {
        return (
          <div className="flex gap-3">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleChange(option)}
                className={`flex-1 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                  response === option
                    ? "border-[var(--primary)] bg-[rgba(124,158,138,0.1)] text-[var(--primary)]"
                    : "border-[rgba(124,158,138,0.24)] bg-white text-[var(--text)] hover:border-[var(--primary)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      }
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

    case "captcha":
      return <Captcha />;

    default:
      return (
        <div className="text-sm text-[var(--muted)]">
          Preview unavailable for this element.
        </div>
      );
  }
}
