import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminAPI.getDashboard,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCustomers = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => adminAPI.getCustomers(params),
  });
};

export const useReviews = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['admin-reviews', params],
    queryFn: () => adminAPI.getReviews(params),
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminAPI.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });
};
