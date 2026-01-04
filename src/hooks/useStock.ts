import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockAPI } from '@/lib/api';

export const useStock = (filters = {}) => {
  return useQuery({
    queryKey: ['stock', filters],
    queryFn: () => stockAPI.getAll(filters),
  });
};

export const useStockStats = () => {
  return useQuery({
    queryKey: ['stock-stats'],
    queryFn: () => stockAPI.getStats(),
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      stockAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stock-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useBulkUpdateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: stockAPI.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stock-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
