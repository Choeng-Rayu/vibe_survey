// src/app/profile/complete/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProfileCompletePage() {
  const router = useRouter();

  const goToSurveys = () => {
    router.push("/surveys");
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <h1 className="mb-4 text-2xl font-bold text-text">Thank you for completing your profile!</h1>
      <button
        onClick={goToSurveys}
        className="rounded bg-primary px-6 py-2 text-white hover:bg-primary/90"
      >
        Back to Survey Feed
      </button>
    </section>
  );
}
