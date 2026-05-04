// src/components/features/auth/OtpInput.tsx
"use client";

import React, { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";

interface OtpInputProps {
  onComplete: (otp: string) => void;
  isLoading: boolean;
  error?: string;
}

const DIGITS = 6;

export default function OtpInput({ onComplete, isLoading, error }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // When all digits are entered, notify parent
  useEffect(() => {
    if (values.every((v) => v !== "")) {
      onComplete(values.join(""));
    }
  }, [values, onComplete]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, ""); // keep digits only
    if (!val) return;
    const newValues = [...values];
    newValues[idx] = val.charAt(0);
    setValues(newValues);
    // move focus to next input if exists
    if (idx < DIGITS - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (values[idx]) {
        // clear current value
        const newValues = [...values];
        newValues[idx] = "";
        setValues(newValues);
      } else if (idx > 0) {
        // move to previous input
        inputsRef.current[idx - 1]?.focus();
        const newValues = [...values];
        newValues[idx - 1] = "";
        setValues(newValues);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-4">
        {Array.from({ length: DIGITS }).map((_, i) => (
          <input
            key={i}
            type="tel"
            maxLength={1}
            value={values[i]}
            disabled={isLoading}
            ref={(el) => { inputsRef.current[i] = el; }}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 text-center border rounded focus:outline-none focus:border-primary disabled:opacity-50"
          />
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
