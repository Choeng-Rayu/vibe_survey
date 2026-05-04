// src/app/settings/consent/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ConsentPage() {
  const router = useRouter();
  const auth = useAuth();
  const [consentGiven, setConsentGiven] = useState(false);

  const handleSave = async () => {
    // Placeholder call to update consent
    if (auth && typeof (auth as any).updateConsent === "function") {
      await (auth as any).updateConsent({ consentGiven });
    }
    router.push("/profile");
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <h1 className="mb-4 text-2xl font-bold text-text">Data Collection Consent</h1>
      <p className="mb-4 max-w-lg text-center text-text">
        We collect usage data to improve the platform and personalize your experience. Please give your explicit consent.
      </p>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-text">I consent to data collection</span>
      </label>
      <button
        onClick={handleSave}
        className="mt-4 rounded bg-primary px-6 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
        disabled={!consentGiven}
      >
        Save
      </button>
    </section>
  );
}
