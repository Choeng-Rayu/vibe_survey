import React, { useState } from 'react';
import { Question } from '@/lib/api/surveys';

interface Props {
  question: Question;
  onAnswer: (value: any) => void;
  defaultValue?: any;
}

const SingleChoice: React.FC<Props> = ({ question, onAnswer, defaultValue }) => {
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);

  const handleChange = (value: string) => {
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div className="single-choice">
      <p className="font-medium mb-2">{question.text}</p>
      <div className="flex flex-col gap-2">
        {question.options?.map(opt => (
          <label key={opt.id} className="inline-flex items-center">
            <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => handleChange(opt.value)}
                className="mr-2"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SingleChoice;
