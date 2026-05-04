import React, { useEffect, useState } from 'react';
import { fetchSurvey, Question, Survey } from '@/lib/api/surveys';
import { applyBranching } from '@/components/features/survey-engine/branchingEngine';
import MultipleChoice from '@/components/features/survey-engine/questions/MultipleChoice';
import SingleChoice from '@/components/features/survey-engine/questions/SingleChoice';
import TextInput from '@/components/features/survey-engine/questions/TextInput';
import ProgressBar from '@/components/features/survey-engine/ProgressBar';
import Navigation from '@/components/features/survey-engine/Navigation';

export interface SurveyEngineProps {
  surveyId: string;
  onComplete: (responses: { questionId: string; answer: any }[]) => void;
}

const SurveyEngine: React.FC<SurveyEngineProps> = ({ surveyId, onComplete }) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, any>>(new Map());

  // Load survey data
  useEffect(() => {
    fetchSurvey(surveyId).then(setSurvey);
  }, [surveyId]);

  // When survey loads or responses change, compute visible questions
  useEffect(() => {
    if (survey) {
      const filtered = applyBranching(survey.questions, responses);
      setVisibleQuestions(filtered);
    }
  }, [survey, responses]);

  const currentQuestion = visibleQuestions[currentIndex];

  const handleAnswer = (value: any) => {
    if (!currentQuestion) return;
    setResponses(prev => new Map(prev).set(currentQuestion.id, value));
  };

  const goNext = () => {
    if (currentIndex < visibleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed
      const output = Array.from(responses.entries()).map(([questionId, answer]) => ({ questionId, answer }));
      onComplete(output);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Determine if current answer is valid (simple non‑empty check)
  const isCurrentAnswerValid = () => {
    if (!currentQuestion) return false;
    const ans = responses.get(currentQuestion.id);
    if (currentQuestion.type === 'text') return typeof ans === 'string' && ans.trim().length > 0;
    if (currentQuestion.type === 'single_choice') return ans !== undefined && ans !== null;
    if (currentQuestion.type === 'multiple_choice') return Array.isArray(ans) && ans.length > 0;
    return false;
  };

  if (!survey) return <div>Loading survey...</div>;
  if (!currentQuestion) return <div>No questions to display.</div>;

  const renderQuestion = () => {
    const commonProps = {
      question: currentQuestion,
      onAnswer: handleAnswer,
      defaultValue: responses.get(currentQuestion.id),
    };
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return <MultipleChoice {...commonProps} />;
      case 'single_choice':
        return <SingleChoice {...commonProps} />;
      case 'text':
        return <TextInput {...commonProps} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="survey-engine">
      <ProgressBar total={visibleQuestions.length} completed={responses.size} />
      <div className="question-container my-4">{renderQuestion()}</div>
      <Navigation
        onPrev={goPrev}
        onNext={goNext}
        disablePrev={currentIndex === 0}
        disableNext={!isCurrentAnswerValid()}
      />
    </div>
  );
};

export default SurveyEngine;
