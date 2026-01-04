import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseAPI } from '@/lib/api';

interface PurchaseFilters {
  status?: string;
  supplier_id?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export const usePurchaseOrders = (filters?: PurchaseFilters) => {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: () => purchaseAPI.getAll(filters),
  });
};

export const usePurchaseOrder = (id: number) => {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => purchaseAPI.getById(id),
    enabled: !!id,
  });
};

export const usePurchaseStats = () => {
  return useQuery({
    queryKey: ['purchase-stats'],
    queryFn: () => purchaseAPI.getStats(),
  });
};

export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => purchaseAPI.getSuppliers(),
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchaseAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
    },
  });
};

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      purchaseAPI.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
    },
  });
};

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchaseAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-stats'] });
    },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchaseAPI.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      purchaseAPI.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};
