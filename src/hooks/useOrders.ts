import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersAPI.getOrders,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrderDetails(parseInt(id)),
    enabled: !!id,
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrderDetails(id),
    enabled: !!id,
  });
};

export const useAdminOrderDetails = (id: number | null) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => ordersAPI.getAdminOrderDetails(id!),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useAllOrders = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => ordersAPI.getAllOrders(params),
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: () => ordersAPI.getOrderStats(),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, trackingNumber }: { id: number; status: string; trackingNumber?: string }) =>
      ordersAPI.updateStatus(id, { status, trackingNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
};
