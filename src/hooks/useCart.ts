import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

// Generate session ID for guest users
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const [sessionId] = useState(getSessionId());
  
  return useQuery({
    queryKey: ['cart', sessionId],
    queryFn: () => cartAPI.getCart(sessionId),
    staleTime: 0, // Always fetch fresh cart data
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const [sessionId] = useState(getSessionId());
  
  return useMutation({
    mutationFn: ({ product_id, quantity }: { product_id: number; quantity: number }) =>
      cartAPI.addItem({ product_id, quantity, sessionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartAPI.updateItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const [sessionId] = useState(getSessionId());
  
  return useMutation({
    mutationFn: () => cartAPI.clearCart(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
