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
    queryFn: authAPI.getProfile,
    enabled: !!localStorage.getItem('auth_token'),
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
