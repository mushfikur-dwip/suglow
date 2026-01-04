import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLogin = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Login successful!');
        
        // Redirect based on role
        if (data.user.role === 'admin' || data.user.role === 'manager') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed. Please try again.');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Registration successful!');
        navigate('/account');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed. Please try again.');
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching profile...');
        const result = await authAPI.getProfile();
        console.log('✅ Profile loaded:', result);
        return result;
      } catch (error) {
        console.log('❌ Profile fetch error:', error);
        // Return empty data instead of throwing
        return null;
      }
    },
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  
  return () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/');
  };
};
