import React from 'react';

interface Props {
  total: number;
  completed: number;
}

const ProgressBar: React.FC<Props> = ({ total, completed }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-surface rounded h-4 mb-4">
      <div
        className="bg-primary h-4 rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
