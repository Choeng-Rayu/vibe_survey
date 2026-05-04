// src/components/features/auth/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validation/authSchemas";
import { generateDeviceFingerprint } from "@/lib/auth/fingerprint";
import { useAuth } from "@/hooks/useAuth";

type FormValues = {
  identifier: string;
  password: string;
};

export default function LoginForm() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [genericError, setGenericError] = useState<string>("");
  const router = useRouter();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema as any),
  });

  const onSubmit = async (data: FormValues) => {
    setGenericError("");
    const fingerprint = generateDeviceFingerprint();
    try {
      // Placeholder auth call – AuthContext login expects email, password
      await auth.login(data.identifier, data.password);
      router.push("/dashboard"); // redirect after login (example)
    } catch (e: any) {
      // In a real implementation we would inspect error status.
      setGenericError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={method === "email" ? "px-4 py-2 bg-primary text-white" : "px-4 py-2 bg-surface"}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod("phone")}
          className={method === "phone" ? "px-4 py-2 bg-primary text-white" : "px-4 py-2 bg-surface"}
        >
          Phone
        </button>
      </div>

      <div>
        <label htmlFor="identifier" className="block mb-1">
          {method === "email" ? "Email" : "Phone (+855…)"}
        </label>
        <input
          id="identifier"
          type={method === "email" ? "email" : "tel"}
          {...register("identifier" as any)}
          placeholder={method === "email" ? "email@example.com" : "12345678"}
          className="w-full border rounded p-2"
        />
        {errors.identifier && (
          <p className="text-red-600 text-sm mt-1">{errors.identifier.message?.toString()}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password" as any)}
          className="w-full border rounded p-2"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message?.toString()}</p>
        )}
      </div>

      {genericError && <p className="text-red-600 text-sm">{genericError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
