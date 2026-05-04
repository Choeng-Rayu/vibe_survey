// src/components/layout/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    } else {
      if (pathname === "/login" || pathname === "/register") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
