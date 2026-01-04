import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersAPI } from '@/lib/api';

export const useCustomers = (params: any) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersAPI.getAll(params),
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: () => customersAPI.getStats(),
  });
};

export const useCustomerDetails = (id: number | null) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersAPI.getDetails(id!),
    enabled: !!id,
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      customersAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
    },
  });
};
