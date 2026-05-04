// src/app/(auth)/login/page.tsx
"use client";

import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-surface">
      <LoginForm />
    </section>
  );
}
