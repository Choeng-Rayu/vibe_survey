import { useCallback, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { generateId } from "@/app/utils/id-generator";
import type { Question, QuestionType } from "../types/question";
import type { Survey } from "../types/survey";
import QuestionList from "./QuestionList";
import BuilderToolbar from "./BuilderToolbar";
import { DndProvider } from "../context/DndContext";

interface SurveyBuilderProps {
  survey: Survey;
  onSurveyChange: (survey: Survey) => void;
}

function createQuestion(questionType: QuestionType, order: number): Question {
  const baseQuestion: Question = {
    id: generateId(),
    order,
    questionText: "New Question",
    questionType,
    required: false,
  };

  if (
    questionType === "single-choice" ||
    questionType === "multiple-choice" ||
    questionType === "image-choice" ||
    questionType === "ranking"
  ) {
    return {
      ...baseQuestion,
      options: [
        { id: generateId(), text: "Option 1" },
        { id: generateId(), text: "Option 2" },
      ],
    };
  }

  if (questionType === "matrix") {
    return {
      ...baseQuestion,
      matrixRows: ["Row 1", "Row 2"],
      matrixColumns: ["Column 1", "Column 2", "Column 3"],
    };
  }

  if (questionType === "rating-scale-5" || questionType === "rating-scale-10") {
    return {
      ...baseQuestion,
      minLabel: "Very dissatisfied",
      maxLabel: "Very satisfied",
    };
  }

  if (questionType === "slider") {
    return {
      ...baseQuestion,
      minLabel: "Low",
      maxLabel: "High",
      minValue: 0,
      maxValue: 10,
    };
  }

  if (questionType === "short-text") {
    return {
      ...baseQuestion,
      charLimit: 120,
    };
  }

  if (questionType === "captcha") {
    return {
      ...baseQuestion,
      questionText: "Verify you're human",
      required: true,
    };
  }

  return baseQuestion;
}

export default function SurveyBuilder({
  survey,
  onSurveyChange,
}: SurveyBuilderProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [isElementDrawerOpen, setIsElementDrawerOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  const handleAddQuestion = useCallback(
    (questionType: QuestionType) => {
      // Prevent adding multiple captchas
      if (questionType === "captcha") {
        const captchaExists = survey.questions.some(
          (q) => q.questionType === "captcha",
        );
        if (captchaExists) {
          alert("Only one reCAPTCHA element can be added to a survey.");
          return;
        }
      }

      const newQuestion = createQuestion(questionType, survey.questions.length);
      onSurveyChange({
        ...survey,
        questions: [...survey.questions, newQuestion],
      });
      setSelectedQuestionId(newQuestion.id);
    },
    [survey, onSurveyChange],
  );

  const handleDeleteQuestion = useCallback(
    (questionId: string) => {
      const updatedQuestions = survey.questions
        .filter((question) => question.id !== questionId)
        .map((question, index) => ({ ...question, order: index }));

      onSurveyChange({
        ...survey,
        questions: updatedQuestions,
      });

      if (selectedQuestionId === questionId) {
        setSelectedQuestionId(null);
      }
    },
    [survey, onSurveyChange, selectedQuestionId],
  );

  const handleDuplicateQuestion = useCallback(
    (questionId: string) => {
      const questionToDuplicate = survey.questions.find(
        (question) => question.id === questionId,
      );
      if (!questionToDuplicate) {
        return;
      }

      const duplicatedQuestion: Question = {
        ...questionToDuplicate,
        id: generateId(),
        order: survey.questions.length,
        options: questionToDuplicate.options?.map((option) => ({
          ...option,
          id: generateId(),
        })),
      };

      onSurveyChange({
        ...survey,
        questions: [...survey.questions, duplicatedQuestion],
      });

      setSelectedQuestionId(duplicatedQuestion.id);
    },
    [survey, onSurveyChange],
  );

  const handleUpdateQuestion = useCallback(
    (updatedQuestion: Question) => {
      onSurveyChange({
        ...survey,
        questions: survey.questions.map((question) =>
          question.id === updatedQuestion.id ? updatedQuestion : question,
        ),
      });
    },
    [survey, onSurveyChange],
  );

  const handleReorderQuestions = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newQuestions = arrayMove(survey.questions, oldIndex, newIndex);
      onSurveyChange({
        ...survey,
        questions: newQuestions.map((question, index) => ({
          ...question,
          order: index,
        })),
      });
    },
    [survey, onSurveyChange],
  );

  // Classname helpers: extract commonly toggled class strings into variables
  const tabButtonClass = (active: boolean) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--primary)] text-[#fbf8f4]"
        : "text-[var(--muted)] hover:bg-[rgba(124,158,138,0.1)] hover:text-[var(--text)]"
    }`;

  const previewToggleClass = (active: boolean) =>
    `relative h-9 w-16 rounded-full border transition-colors ${
      active
        ? "border-[rgba(124,158,138,0.45)] bg-[rgba(124,158,138,0.18)]"
        : "border-[var(--border)] bg-[rgba(242,237,229,0.92)]"
    }`;

  const previewKnobClass = (active: boolean) =>
    `absolute top-1 h-7 w-7 rounded-full bg-white shadow-sm transition-transform ${
      active ? "-translate-x-7" : "translate-x-0"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_50%_15%,rgba(124,158,138,0.12),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(196,149,106,0.12),transparent_28%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-[var(--border)] bg-[rgba(250,247,242,0.88)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Form Builder
                </p>
                <h1 className="text-lg font-medium text-[var(--text)] sm:text-2xl">
                  Recruitment Company Survey
                </h1>
                <p className="text-sm text-[var(--muted)]">
                  Last edited just now
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <button className="rounded-full border border-[var(--border)] bg-[rgba(242,237,229,0.92)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[rgba(124,158,138,0.32)] hover:bg-[rgba(124,158,138,0.08)]">
                Add Collaborators
              </button>
              <button className="rounded-full border border-[var(--border)] bg-[rgba(242,237,229,0.92)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[rgba(124,158,138,0.32)] hover:bg-[rgba(124,158,138,0.08)]">
                Help
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--border)] bg-[rgba(242,237,229,0.8)]">
            <div className="relative mx-auto w-full max-w-[1600px] px-4 py-3 lg:px-6">
              {/* Center tabs */}
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  {[
                    { key: "build", label: "Build" },
                    { key: "settings", label: "Settings" },
                    { key: "publish", label: "Publish" },
                  ].map((tab, index) => (
                    <button
                      key={tab.key}
                      className={tabButtonClass(index === 0)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right-side preview toggle */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 lg:right-6">
                <label className="flex items-center gap-3 text-sm font-medium text-[var(--text)]">
                  <span>Preview Form</span>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode((value) => !value)}
                    className={previewToggleClass(isPreviewMode)}
                    aria-pressed={isPreviewMode}
                  >
                    <span className={previewKnobClass(isPreviewMode)} />
                  </button>
                </label>
              </div>
            </div>
          </div>
        </header>

        <div className="relative flex flex-1">
          <BuilderToolbar
            isOpen={isElementDrawerOpen}
            onClose={() => setIsElementDrawerOpen(false)}
            onAddQuestion={handleAddQuestion}
          />

          <button
            type="button"
            onClick={() => setIsElementDrawerOpen(true)}
            className="fixed left-0 top-1/3 z-20 rounded-r-[22px] bg-[var(--text)] px-5 py-4 text-base font-medium text-[var(--bg)] shadow-[0_16px_36px_rgba(28,28,26,0.18)] transition-colors hover:bg-[var(--primary)]"
          >
            Add Element <span className="ml-3 text-2xl leading-none">+</span>
          </button>

          <main className="mx-auto flex w-full max-w-[1600px] flex-1 gap-8 px-4 py-8 lg:px-6 lg:py-10">
            <section className="flex min-w-0 flex-1 justify-center">
              <div className="w-full max-w-[920px]">
                <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(250,247,242,0.92)] shadow-[0_16px_44px_rgba(28,28,26,0.05)]">
                  <div className="border-b border-[var(--border)] bg-[linear-gradient(180deg,rgba(124,158,138,0.12),rgba(242,237,229,0.5))] px-6 py-8 text-center sm:px-10 sm:py-10">
                    <input
                      type="text"
                      value={survey.title}
                      readOnly={isPreviewMode}
                      onChange={(event) =>
                        onSurveyChange({ ...survey, title: event.target.value })
                      }
                      className="w-full bg-transparent text-center text-4xl font-medium outline-none sm:text-5xl"
                      style={{ letterSpacing: "-0.02em" }}
                    />
                    <textarea
                      value={survey.description || ""}
                      readOnly={isPreviewMode}
                      onChange={(event) =>
                        onSurveyChange({
                          ...survey,
                          description: event.target.value,
                        })
                      }
                      className="mt-4 w-full resize-none bg-transparent text-center text-base leading-7 text-[var(--muted)] outline-none"
                      rows={2}
                    />
                  </div>

                  <div className="bg-[rgba(250,247,242,0.88)] px-4 py-5 sm:px-8 sm:py-8">
                    {survey.questions.length > 0 ? (
                      <>
                        <DndProvider
                          onReorder={handleReorderQuestions}
                          isPreviewMode={isPreviewMode}
                        >
                          <QuestionList
                            questions={survey.questions}
                            selectedQuestionId={selectedQuestionId}
                            isPreviewMode={isPreviewMode}
                            onSelectQuestion={setSelectedQuestionId}
                            onDeleteQuestion={handleDeleteQuestion}
                            onDuplicateQuestion={handleDuplicateQuestion}
                            onUpdateQuestion={handleUpdateQuestion}
                            responses={responses}
                            onResponseChange={(questionId, value) => {
                              setResponses((prev) => ({
                                ...prev,
                                [questionId]: value,
                              }));
                            }}
                          />
                        </DndProvider>
                        <div className="mt-8 flex items-center justify-center">
                          <button
                            type="button"
                            disabled={!isPreviewMode}
                            onClick={() => {
                              if (isPreviewMode) {
                                alert(
                                  `Form submitted! Responses:\n${JSON.stringify(
                                    responses,
                                    null,
                                    2,
                                  )}`,
                                );
                                setResponses({});
                              }
                            }}
                            className="rounded-full bg-[#7C9E8A] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[rgba(124,158,138,0.28)] bg-[rgba(124,158,138,0.06)] px-6 py-14 text-center">
                        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                          Empty form
                        </p>
                        <h2 className="mt-4 text-2xl font-medium text-[var(--text)]">
                          Add your first element
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
                          Use the Add Element button on the left to insert a
                          question, rating scale, or text field into the canvas.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
