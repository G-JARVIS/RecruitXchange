import api from './api';
import type { LearningPath, Lesson, ApiResponse, PaginatedResponse } from '../types';

interface LearningFilters {
  page?: number;
  limit?: number;
  domain?: string;
  difficulty?: string;
  search?: string;
}

export const learningService = {
  getPaths: async (filters: LearningFilters = {}): Promise<PaginatedResponse<LearningPath>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const response = await api.get<PaginatedResponse<LearningPath>>(`/learning/paths?${params.toString()}`);
    return response.data;
  },

  getPathById: async (id: string): Promise<ApiResponse<LearningPath>> => {
    const response = await api.get(`/learning/paths/${id}`);
    return response.data;
  },

  getLessonById: async (id: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.get(`/learning/lessons/${id}`);
    return response.data;
  },
};
