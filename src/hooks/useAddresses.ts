import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../lib/api';

// API helpers
const addressesAPI = {
  getAll: () => apiClient.get('/addresses'),
  create: (data: any) => apiClient.post('/addresses', data),
  update: (id: number, data: any) => apiClient.put(`/addresses/${id}`, data),
  delete: (id: number) => apiClient.delete(`/addresses/${id}`),
  setDefault: (id: number) => apiClient.patch(`/addresses/${id}/default`)
};

// Get all addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching addresses...');
        const response = await addressesAPI.getAll();
        console.log('✅ Addresses loaded:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Addresses fetch error:', error);
        // Return empty data instead of throwing
        return { data: [] };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Create address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addressesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  });
};

// Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      addressesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update address');
    }
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  });
};

// Set default address
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressesAPI.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to set default address');
    }
  });
};
