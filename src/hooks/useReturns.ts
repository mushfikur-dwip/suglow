import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { returnsAPI } from '@/lib/api';

export const useReturns = (params: any) => {
  return useQuery({
    queryKey: ['returns', params],
    queryFn: () => returnsAPI.getAll(params),
  });
};

export const useReturnStats = () => {
  return useQuery({
    queryKey: ['return-stats'],
    queryFn: () => returnsAPI.getStats(),
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => returnsAPI.processRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return-stats'] });
    },
  });
};

export const useCancelRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => returnsAPI.cancelRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return-stats'] });
    },
  });
};
