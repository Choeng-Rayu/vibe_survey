import React, { useState } from 'react';
import { Question } from '@/lib/api/surveys';

interface Props {
  question: Question;
  onAnswer: (value: any) => void;
  defaultValue?: any;
}

const MultipleChoice: React.FC<Props> = ({ question, onAnswer, defaultValue = [] }) => {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const toggle = (value: string) => {
    let newSelected: string[];
    if (selected.includes(value)) {
      newSelected = selected.filter(v => v !== value);
    } else {
      newSelected = [...selected, value];
    }
    setSelected(newSelected);
    onAnswer(newSelected);
  };

  return (
    <div className="multiple-choice">
      <p className="font-medium mb-2">{question.text}</p>
      <div className="grid gap-2">
        {question.options?.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`px-4 py-2 rounded ${selected.includes(opt.value) ? 'bg-primary text-white' : 'bg-surface'}
              `}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
