// contexts/AuthContext.tsx
"use client";

import React, { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/client";
import { refreshToken } from "../lib/auth/refreshToken";
import { getAuthToken } from "../lib/auth/tokenManager";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(!!getAuthToken());
  const queryClient = useQueryClient();

  // Stubs – replace URL endpoints as needed.
  const login = useCallback(async (email: string, password: string) => {
    await apiClient.post("/auth/login", { email, password });
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.post("/auth/logout");
    setAuthenticated(false);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    await apiClient.post("/auth/register", { email, password });
    // assume immediate login after registration
    setAuthenticated(true);
  }, []);

  const verifyPhone = useCallback(async (code: string) => {
    await apiClient.post("/auth/verify-phone", { code });
    // No state change needed here.
  }, []);

  // Background token refresh every 5 minutes.
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation we would call the refresh endpoint.
      refreshToken().catch(() => {
        // If refresh fails, consider user logged out.
        setAuthenticated(false);
      });
      // Optionally invalidate queries to refetch protected data.
      queryClient.invalidateQueries();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    register,
    verifyPhone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
