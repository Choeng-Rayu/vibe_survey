// src/app/(auth)/register/page.tsx
"use client";

import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-surface">
      <RegisterForm />
    </section>
  );
}
