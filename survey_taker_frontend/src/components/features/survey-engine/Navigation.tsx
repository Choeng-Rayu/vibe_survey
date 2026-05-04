import React from 'react';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}

const Navigation: React.FC<Props> = ({ onPrev, onNext, disablePrev, disableNext }) => (
  <div className="flex justify-between mt-4">
    <button
      type="button"
      onClick={onPrev}
      disabled={disablePrev}
      className={`px-4 py-2 rounded ${disablePrev ? 'bg-muted cursor-not-allowed' : 'bg-primary text-white'}
      `}
    >
      Previous
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={disableNext}
      className={`px-4 py-2 rounded ${disableNext ? 'bg-muted cursor-not-allowed' : 'bg-primary text-white'}
      `}
    >
      Next
    </button>
  </div>
);

export default Navigation;
