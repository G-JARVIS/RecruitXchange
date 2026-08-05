import api from './api';
import type { Drive, PaginatedResponse, ApiResponse, Application } from '../types';

interface DriveFilters {
  page?: number;
  limit?: number;
  domain?: string;
  company?: string;
  search?: string;
  sortBy?: string;
}

export const driveService = {
  getDrives: async (filters: DriveFilters = {}): Promise<PaginatedResponse<Drive>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const response = await api.get<PaginatedResponse<Drive>>(`/drives?${params.toString()}`);
    return response.data;
  },

  getDriveById: async (id: string): Promise<ApiResponse<{ drive: Drive; application: Application | null }>> => {
    const response = await api.get(`/drives/${id}`);
    return response.data;
  },

  expressInterest: async (driveId: string): Promise<ApiResponse<Application>> => {
    const response = await api.post(`/drives/${driveId}/interest`);
    return response.data;
  },

  toggleBookmark: async (driveId: string): Promise<ApiResponse<{ bookmarked: boolean }>> => {
    const response = await api.post(`/drives/${driveId}/bookmark`);
    return response.data;
  },

  getBookmarkedDrives: async (): Promise<ApiResponse<Drive[]>> => {
    const response = await api.get('/drives/user/bookmarks');
    return response.data;
  },
};
