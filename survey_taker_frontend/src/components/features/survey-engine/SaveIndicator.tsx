import React, { useEffect, useState } from 'react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  onRetry?: () => void;
}

/**
 * Visual indicator for auto‑save state.
 * - idle: renders nothing
 * - saving: spinner
 * - saved: checkmark that fades after 2 seconds
 * - error: red X with a retry button
 */
export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status, onRetry }) => {
  const [showSaved, setShowSaved] = useState(true);

  // Reset fade timer when status becomes 'saved'.
  useEffect(() => {
    if (status === 'saved') {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
    // Ensure saved icon is hidden for other statuses.
    setShowSaved(false);
  }, [status]);

  if (status === 'idle') return null;

  if (status === 'saving') {
    return (
      <div className="flex items-center space-x-2 text-gray-600" aria-label="saving">
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span>Saving…</span>
      </div>
    );
  }

  if (status === 'saved' && showSaved) {
    return (
      <div className="flex items-center space-x-2 text-green-600" aria-label="saved">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 00-1.408-1.42l-7.1 7.057-3.293-3.292a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
            clipRule="evenodd"
          />
        </svg>
        <span>Saved</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center space-x-2 text-red-600" aria-label="error">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2a1 1 0 11-2 0zm0 4a1 1 0 102 0 1 1 0 10-2 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Error saving</span>
        {onRetry && (
          <button
            className="ml-2 rounded bg-red-100 px-2 py-1 text-sm text-red-800 hover:bg-red-200"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
};
