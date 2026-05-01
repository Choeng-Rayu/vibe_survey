import { apiClient } from '@/lib/apiClient';

interface AuthResult {
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<AuthResult | null> {
    try {
      const result = await apiClient.post<AuthResult>('/auth/login', {
        email,
        password,
        role: 'admin',
      });
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getProfile(): Promise<AuthResult | null> {
    try {
      const result = await apiClient.get<AuthResult>('/auth/me');
      return result;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !window.location.pathname.startsWith('/login');
  }
}

export const authService = new AuthService();
