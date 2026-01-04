import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../lib/api';

// API helpers
const notificationsAPI = {
  getSettings: () => apiClient.get('/notifications'),
  updateSettings: (data: any) => apiClient.put('/notifications', data)
};

// Get notification settings
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await notificationsAPI.getSettings();
      return response.data;
    }
  });
};

// Update notification settings
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => notificationsAPI.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast.success('Notification settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    }
  });
};
