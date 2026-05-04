// src/app/(auth)/verify-phone/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "@/components/features/auth/OtpInput";
import { useAuth } from "@/hooks/useAuth";
import useOtpTimer from "@/hooks/useOtpTimer";

// Simulated OTP sending – replace with real API call.
const sendOtp = async () => {
  return new Promise<void>((resolve) => setTimeout(resolve, 500));
};

export default function VerifyPhonePage() {
  const router = useRouter();
  const auth = useAuth();
  const { canResend, secondsLeft, resetTimer } = useOtpTimer();
  const [sending, setSending] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Send OTP on mount
  useEffect(() => {
    const initiate = async () => {
      setSending(true);
      try {
        await sendOtp();
      } catch (e) {
        // ignore for placeholder
      } finally {
        setSending(false);
      }
    };
    initiate();
  }, []);

  const handleResend = async () => {
    resetTimer();
    setSending(true);
    try {
      await sendOtp();
    } catch (e) {
      // ignore placeholder errors
    } finally {
      setSending(false);
    }
  };

  const handleComplete = async (otp: string) => {
    setError("");
    setVerifying(true);
    try {
      await auth.verifyPhone(otp);
      router.push("/profile/complete");
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Enter OTP</h2>
        <OtpInput onComplete={handleComplete} isLoading={verifying || sending} error={error} />
        <button
          onClick={handleResend}
          disabled={!canResend || sending}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          {canResend ? "Resend OTP" : `Resend in ${secondsLeft}s`}
        </button>
      </div>
    </section>
  );
}
