// src/components/features/auth/RegisterForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registrationEmailSchema, registrationPhoneSchema } from "@/lib/validation/authSchemas";
import { generateDeviceFingerprint } from "@/lib/auth/fingerprint";
import { useAuth } from "@/hooks/useAuth";

// Union type for form data – we will narrow based on method
type EmailForm = {
  method: "email";
  email: string;
  password: string;
};

type PhoneForm = {
  method: "phone";
  phone: string;
  password: string;
};

type FormValues = EmailForm | PhoneForm;

export default function RegisterForm() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const router = useRouter();
  const auth = useAuth();

  const schema = method === "email" ? registrationEmailSchema : registrationPhoneSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { method } as any,
  });

  const onSubmit = async (data: FormValues) => {
    // Build payload based on method
    const fingerprint = generateDeviceFingerprint();
    if (method === "email") {
      const { email, password } = data as EmailForm;
      await auth.register(email, password); // placeholder – ignores fingerprint
    } else {
      let { phone, password } = data as PhoneForm;
      if (!phone.startsWith("+855")) {
        phone = "+855" + phone.replace(/^\+?/, "");
      }
      // Placeholder: we could call a registerPhone endpoint, but AuthContext only supports email.
      // Use same register stub for demonstration.
      await auth.register(phone, password);
    }
    // After successful registration navigate to verification step
    router.push("/auth/verify-phone");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto">
      {/* Method toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={
            method === "email" ? "px-4 py-2 bg-primary text-white" : "px-4 py-2 bg-surface"
          }
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod("phone")}
          className={
            method === "phone" ? "px-4 py-2 bg-primary text-white" : "px-4 py-2 bg-surface"
          }
        >
          Phone
        </button>
      </div>

      {method === "email" && (
        <>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email" as any)}
              className="w-full border rounded p-2"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message?.toString()}</p>
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
        </>
      )}

      {method === "phone" && (
        <>
          <div>
            <label htmlFor="phone" className="block mb-1">
              Phone (+855…)
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone" as any)}
              placeholder="e.g., 12345678"
              className="w-full border rounded p-2"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message?.toString()}</p>
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
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
