// src/app/profile/page.tsx
"use client";

import React from "react";
import ProfileForm from "@/components/features/profile/ProfileForm";
import CompletenessBar from "@/components/features/profile/CompletenessBar";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const _auth = useAuth(); // placeholder usage
  // Placeholder completeness; replace with real auth call when available
  const completeness = 70;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <h1 className="mb-6 text-2xl font-bold text-text">Complete Your Profile</h1>
      <div className="w-full max-w-lg space-y-6">
        <CompletenessBar percentage={completeness} />
        <ProfileForm />
      </div>
    </section>
  );
}
