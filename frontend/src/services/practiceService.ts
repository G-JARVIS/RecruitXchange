import api from './api';
import type { PaginatedResponse, ApiResponse } from '../types';

interface PracticeFilters {
  page?: number;
  limit?: number;
  type?: string;
  difficulty?: string;
  tags?: string;
  search?: string;
}

export const practiceService = {
  getQuestions: async (filters: PracticeFilters = {}): Promise<PaginatedResponse<any>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const response = await api.get(`/practice/questions?${params.toString()}`);
    return response.data;
  },

  getQuestionById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/practice/questions/${id}`);
    return response.data;
  },

  submitAttempt: async (id: string, payload: {
    answer?: string;
    code?: string;
    language?: string;
    timeTaken: number;
    hintsUsed?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post(`/practice/questions/${id}/attempt`, payload);
    return response.data;
  },

  getAttempts: async (): Promise<ApiResponse<any>> => {
    const response = await api.get(`/practice/attempts`);
    return response.data;
  },

  getMasteryRadar: async (): Promise<ApiResponse<any>> => {
    const response = await api.get(`/practice/mastery`);
    return response.data;
  },
};
