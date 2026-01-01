import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from '@/lib/api';
import { toast } from 'sonner';

// Get wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistAPI.getWishlist(),
  });
};

// Add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (product_id: number) => wishlistAPI.addToWishlist(product_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add to wishlist');
    },
  });
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => wishlistAPI.removeFromWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to remove from wishlist');
    },
  });
};

// Check if product is in wishlist
export const useCheckWishlist = (productId: number | undefined) => {
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: () => {
      if (!productId) return { inWishlist: false };
      return wishlistAPI.checkWishlist(productId);
    },
    enabled: !!productId,
  });
};
