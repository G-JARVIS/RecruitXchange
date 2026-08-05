import api from './api';
import type { PredictorResult, StudentProfile, ApiResponse } from '../types';

interface DashboardStats {
  readinessScore: number;
  totalAttempts: number;
  passRate: number;
  level: number;
  xp: number;
  badges: string[];
  onboardingComplete: boolean;
}

export const studentService = {
  getProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<ApiResponse<StudentProfile>> => {
    const response = await api.put('/student/profile', data);
    return response.data;
  },

  uploadResume: async (file: File): Promise<ApiResponse<{ resumeUrl: string; atsScore: number; atsKeywords: string[] }>> => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  runPredictor: async (): Promise<ApiResponse<PredictorResult>> => {
    const response = await api.post('/student/predictor/run');
    return response.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<{ stats: DashboardStats; profile: StudentProfile; recentAttempts: any[] }>> => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },
};
