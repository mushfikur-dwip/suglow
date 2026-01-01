import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Only redirect if on protected routes
      if (window.location.pathname.startsWith('/account') || 
          window.location.pathname.startsWith('/admin')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;

// API endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const productsAPI = {
  getAll: (params) => apiClient.get('/products', { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: (sessionId) => apiClient.get('/cart', { params: { sessionId } }),
  addItem: (data) => apiClient.post('/cart', data),
  updateItem: (id, data) => apiClient.put(`/cart/${id}`, data),
  removeItem: (id) => apiClient.delete(`/cart/${id}`),
  clearCart: (sessionId) => apiClient.delete('/cart', { params: { sessionId } }),
};

export const ordersAPI = {
  create: (data) => apiClient.post('/orders', data),
  getOrders: () => apiClient.get('/orders'),
  getOrderDetails: (id) => apiClient.get(`/orders/${id}`),
  getAllOrders: (params) => apiClient.get('/orders/all', { params }),
  updateStatus: (id, data) => apiClient.put(`/orders/${id}/status`, data),
};

export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getCustomers: (params) => apiClient.get('/admin/customers', { params }),
  getReviews: (params) => apiClient.get('/admin/reviews', { params }),
  updateReviewStatus: (id, status) => apiClient.put(`/admin/reviews/${id}/status`, { status }),
};

export const wishlistAPI = {
  getWishlist: () => apiClient.get('/wishlist'),
  addToWishlist: (product_id) => apiClient.post('/wishlist', { product_id }),
  removeFromWishlist: (id) => apiClient.delete(`/wishlist/${id}`),
  checkWishlist: (product_id) => apiClient.get(`/wishlist/check/${product_id}`),
};

export const rewardsAPI = {
  getRewards: () => apiClient.get('/rewards'),
};
