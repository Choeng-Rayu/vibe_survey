import React, { useState } from 'react';
import { Question } from '@/lib/api/surveys';

interface Props {
  question: Question;
  onAnswer: (value: any) => void;
  defaultValue?: any;
}

const TextInput: React.FC<Props> = ({ question, onAnswer, defaultValue = '' }) => {
  const [value, setValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onAnswer(e.target.value);
  };

  return (
    <div className="text-input">
      <label className="block font-medium mb-2">{question.text}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
};

export default TextInput;
