"use client";

import { useMemo, useState } from "react";
import type { QuestionType } from "../types/question";

interface BuilderToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (questionType: QuestionType) => void;
}

const questionTypeCategories: Record<string, QuestionType[]> = {
  Basic: [
    "single-choice",
    "multiple-choice",
    "checkbox",
    "yes-no",
    "short-text",
    "long-text",
  ],
  Rating: ["rating-scale-5", "rating-scale-10", "nps", "likert"],
  Advanced: ["image-choice", "matrix", "ranking", "slider", "date-time"],
};

const questionTypeIcons: Record<QuestionType, string> = {
  "single-choice": "◉",
  "multiple-choice": "☑",
  checkbox: "☐",
  "short-text": "T",
  "long-text": "¶",
  "rating-scale-5": "★",
  "rating-scale-10": "✦",
  nps: "N",
  likert: "≋",
  "image-choice": "▣",
  matrix: "▦",
  "yes-no": "Y/N",
  ranking: "⇅",
  slider: "—",
  "date-time": "◷",
};

const questionTypeLabels: Record<QuestionType, string> = {
  "single-choice": "Single choice",
  "multiple-choice": "Multiple choice",
  checkbox: "Checkboxes",
  "short-text": "Short text",
  "long-text": "Long text",
  "rating-scale-5": "5-point rating",
  "rating-scale-10": "10-point rating",
  nps: "Net Promoter Score",
  likert: "Likert scale",
  "image-choice": "Image choice",
  matrix: "Matrix grid",
  "yes-no": "Yes / No",
  ranking: "Ranking",
  slider: "Slider",
  "date-time": "Date / Time",
};

export default function BuilderToolbar({
  isOpen,
  onClose,
  onAddQuestion,
}: BuilderToolbarProps) {
  const [openCategory, setOpenCategory] = useState<string>("Basic");
  const categories = useMemo(() => Object.entries(questionTypeCategories), []);

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[rgba(28,28,26,0.2)] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Close add element panel"
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-full max-w-[340px] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-[12px_0_40px_rgba(28,28,26,0.06)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Form Elements
            </p>
            <h2 className="mt-1 text-lg font-medium text-[var(--text)]">
              Add Element
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-lg text-[var(--muted)] transition-colors hover:border-[rgba(124,158,138,0.35)] hover:bg-[rgba(124,158,138,0.1)] hover:text-[var(--text)]"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <div className="border-b border-[var(--border)] px-4 py-3">
          <div className="grid grid-cols-3 gap-2 rounded-full bg-[rgba(242,237,229,0.72)] p-1">
            {categories.map(([category]) => (
              <button
                key={category}
                type="button"
                onClick={() => setOpenCategory(category)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                  openCategory === category
                    ? "bg-[var(--primary)] text-[#fbf8f4]"
                    : "text-[var(--muted)] hover:bg-[rgba(124,158,138,0.12)] hover:text-[var(--text)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-2">
            {questionTypeCategories[openCategory]?.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAddQuestion(type);
                  onClose();
                }}
                className="flex w-full items-center gap-4 rounded-[18px] border border-[var(--border)] bg-[rgba(250,247,242,0.92)] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[rgba(124,158,138,0.34)] hover:bg-[rgba(124,158,138,0.08)]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[rgba(28,28,26,0.9)] text-base font-medium text-[#fbf8f4]">
                  {questionTypeIcons[type]}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[var(--text)]">
                    {questionTypeLabels[type]}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                    Insert this element into the survey canvas.
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-dashed border-[rgba(124,158,138,0.28)] bg-[rgba(124,158,138,0.08)] p-4 text-sm text-[var(--muted)]">
            Payments and widgets are being added next. The current builder focuses
            on survey questions, ratings, and matrix-style inputs.
          </div>
        </div>
      </aside>
    </>
  );
}
