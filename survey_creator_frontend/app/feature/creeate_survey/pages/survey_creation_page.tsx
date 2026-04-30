"use client";

import { useState } from "react";
import SurveyBuilder from "../components/SurveyBuilder";
import type { Question } from "../types/question";
import type { Survey } from "../types/survey";
import { generateId } from "@/app/utils/id-generator";
import {  } from "react";

function createStarterQuestions(): Question[] {
  return [
    {
      id: generateId(),
      order: 0,
      questionText: "What is your overall satisfaction with our recruitment services?",
      questionType: "rating-scale-5",
      description: "Rate your experience from low to high satisfaction.",
      required: true,
      minLabel: "Very bad",
      maxLabel: "Excellent",
    },
    {
      id: generateId(),
      order: 1,
      questionText: "Which of our services did you use?",
      questionType: "checkbox",
      required: true,
      options: [
        { id: generateId(), text: "Job Placement" },
        { id: generateId(), text: "Resume Review" },
        { id: generateId(), text: "Interview Coaching" },
        { id: generateId(), text: "Other" },
      ],
    },
    {
      id: generateId(),
      order: 2,
      questionText: "How likely are you to recommend our company to others?",
      questionType: "nps",
      required: true,
      minLabel: "Not likely",
      maxLabel: "Extremely likely",
    },
    {
      id: generateId(),
      order: 3,
      questionText: "Please share any additional comments or suggestions.",
      questionType: "long-text",
      required: false,
      description: "Optional comments help us improve future recruitment support.",
    },
  ];
}

export function createStarterSurvey(): Survey {
  return {
    id: "survey-create-1",
    title: "Recruitment Company Survey",
    description: "We value your feedback. Please share your experience with our recruitment services.",
    status: "draft",
    questions: createStarterQuestions(),
    randomizeQuestionOrder: false,
    attentionChecks: true,
  };
}

interface SurveyCreationPageProps {
  initialSurvey?: Survey;
}

export default function SurveyCreationPage({
  initialSurvey = createStarterSurvey(),
}: SurveyCreationPageProps) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  return (
    <main>
      <SurveyBuilder survey={survey} onSurveyChange={setSurvey} />
    </main>
  );
}