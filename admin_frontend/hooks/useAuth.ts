import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const profile = await authService.getProfile();
      if (!cancelled) {
        if (profile?.user) {
          setUser(profile.user);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result?.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
