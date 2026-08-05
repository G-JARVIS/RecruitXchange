import api from './api';
import type { AuthResponse, User, StudentProfile } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<{ data: User & { profile?: StudentProfile } }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  validate: async (): Promise<{ data: { valid: boolean; userId: string; role: string } }> => {
    const response = await api.get('/auth/validate');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getGoogleOAuthUrl: (): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}/api/auth/google`;
  },
};
