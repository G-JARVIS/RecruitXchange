import api from './api';
import type { Notification, ApiResponse } from '../types';

interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  getNotifications: async (unreadOnly = false): Promise<ApiResponse<NotificationResponse>> => {
    const response = await api.get(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
    return response.data;
  },

  markRead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async (): Promise<ApiResponse<null>> => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
