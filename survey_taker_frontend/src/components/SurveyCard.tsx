'use client';

import { Survey } from '@/types';

interface SurveyCardProps {
  survey: Survey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const progress = Math.round((survey.totalResponses / survey.maxResponses) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-sage-200 hover:border-sage-300 transition-all">
      {/* Category Badge */}
      <div className="inline-block mb-4 px-3 py-1 rounded-full bg-sage-50 text-sage-700 text-xs font-medium">
        {survey.category}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-cormorant text-text-primary mb-2">{survey.title}</h3>
      <p className="text-sm text-text-muted mb-4">{survey.description}</p>

      {/* Meta Info */}
      <div className="flex justify-between items-center text-xs text-text-muted mb-4">
        <span>⏱️ {survey.estimatedTime} min</span>
        <span>👥 {progress}% complete</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sage-100 rounded-full h-1.5 mb-4">
        <div className="bg-sage-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
      </div>

      {/* Reward & Button */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-sage-600">${survey.reward.toFixed(2)}</span>
        <button className="px-4 py-2 bg-sage-500 text-white rounded-full text-sm font-medium hover:bg-sage-600 transition-colors">
          Take Survey
        </button>
      </div>
    </div>
  );
}
