// src/hooks/useOtpTimer.ts
"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook to manage OTP resend timer.
 * Starts at 60 seconds and counts down each second.
 * When the timer reaches 0, `canResend` becomes true.
 */
export default function useOtpTimer() {
  const INITIAL_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Decrease timer every second
  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(INITIAL_SECONDS);
    setCanResend(false);
  }, []);

  return { canResend, secondsLeft, resetTimer } as const;
}
