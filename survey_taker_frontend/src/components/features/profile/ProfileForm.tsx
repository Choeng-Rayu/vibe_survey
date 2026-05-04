// src/components/features/profile/ProfileForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type Profile } from "@/lib/validation/profileSchemas";
import { useAuth } from "@/hooks/useAuth";
import CompletenessBar from "./CompletenessBar";
import InterestsSelector from "./InterestsSelector";

export default function ProfileForm() {
  const auth = useAuth() as any; // placeholder methods
  const [success, setSuccess] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema as any),
  });

  // Load existing profile on mount
  useEffect(() => {
    (async () => {
      if (auth.getUserProfile) {
        const data = await auth.getUserProfile();
        if (data) {
          reset(data);
          // Compute initial completeness based on filled fields
          computeCompleteness(data);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeCompleteness = (data: Partial<Profile>) => {
    const fields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "location",
      "education",
      "employment",
      "incomeRange",
      "interests",
    ];
    const filled = fields.filter((f) => {
      const value = (data as any)[f];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;
    setPercentage(Math.round((filled / fields.length) * 100));
  };

  const onSubmit = async (data: Profile) => {
    setSuccess("");
    try {
      await auth.updateProfile(data);
      setSuccess("Profile saved successfully.");
      computeCompleteness(data);
    } catch (e: any) {
      setSuccess("Failed to save profile.");
    }
  };

  // Keep completeness in sync when interests change via selector
  const interests = watch("interests");
  useEffect(() => {
    computeCompleteness({ ...watch(), interests });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4">
      <CompletenessBar percentage={percentage} />

      <div>
        <label className="block mb-1">First Name</label>
        <input className="w-full border rounded p-2" {...register("firstName" as any)} />
        {errors.firstName && (
          <p className="text-red-600 text-sm">{errors.firstName.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Last Name</label>
        <input className="w-full border rounded p-2" {...register("lastName" as any)} />
        {errors.lastName && (
          <p className="text-red-600 text-sm">{errors.lastName.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Age</label>
        <input type="number" className="w-full border rounded p-2" {...register("age" as any)} />
        {errors.age && (
          <p className="text-red-600 text-sm">{errors.age.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Gender</label>
        <select className="w-full border rounded p-2" {...register("gender" as any)}>
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-600 text-sm">{errors.gender.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Location</label>
        <input className="w-full border rounded p-2" {...register("location" as any)} />
        {errors.location && (
          <p className="text-red-600 text-sm">{errors.location.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Education</label>
        <input className="w-full border rounded p-2" {...register("education" as any)} />
        {errors.education && (
          <p className="text-red-600 text-sm">{errors.education.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Employment</label>
        <input className="w-full border rounded p-2" {...register("employment" as any)} />
        {errors.employment && (
          <p className="text-red-600 text-sm">{errors.employment.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Income Range</label>
        <input className="w-full border rounded p-2" {...register("incomeRange" as any)} />
        {errors.incomeRange && (
          <p className="text-red-600 text-sm">{errors.incomeRange.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Interests</label>
        <InterestsSelector
          selected={watch("interests") || []}
          onChange={(val) => setValue("interests", val as any, { shouldValidate: true })}
        />
        {errors.interests && (
          <p className="text-red-600 text-sm">{errors.interests.message?.toString()}</p>
        )}
      </div>

      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
