// src/hooks/useAuth.ts
"use client";

// Re-export the root-level useAuth hook to satisfy @/* alias imports.
import { useAuth as rootUseAuth } from "../../hooks/useAuth";
export const useAuth = rootUseAuth;
