import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://orange-rook-646425.hostingersite.com/api';

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
    
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
  getBySlug: (slug) => apiClient.get(`/products/by-slug/${slug}`),
  getById: (id) => apiClient.get(`/products/${id}`),
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
  getAllOrders: (params) => apiClient.get('/orders/admin/all', { params }),
  getOrderStats: () => apiClient.get('/orders/admin/stats'),  getAdminOrderDetails: (id: number) => apiClient.get(`/orders/admin/${id}`),  updateStatus: (id, data) => apiClient.put(`/orders/${id}/status`, data),
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

export const purchaseAPI = {
  getAll: (params) => apiClient.get('/purchase', { params }),
  getById: (id) => apiClient.get(`/purchase/${id}`),
  getStats: () => apiClient.get('/purchase/stats'),
  create: (data) => apiClient.post('/purchase', data),
  updateStatus: (id, data) => apiClient.put(`/purchase/${id}/status`, data),
  delete: (id) => apiClient.delete(`/purchase/${id}`),
  getSuppliers: () => apiClient.get('/purchase/suppliers/all'),
  createSupplier: (data) => apiClient.post('/purchase/suppliers', data),
  updateSupplier: (id, data) => apiClient.put(`/purchase/suppliers/${id}`, data),
};

export const stockAPI = {
  getAll: (params) => apiClient.get('/stock', { params }),
  getStats: () => apiClient.get('/stock/stats'),
  update: (id, data) => apiClient.put(`/stock/${id}`, data),
  bulkUpdate: (updates) => apiClient.put('/stock/bulk/update', { updates }),
};

export const reviewsAPI = {
  getAll: (params) => apiClient.get('/reviews', { params }),
  getStats: () => apiClient.get('/reviews/stats'),
  updateStatus: (id, status) => apiClient.put(`/reviews/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/reviews/${id}`),
  bulkUpdateStatus: (review_ids, status) => apiClient.put('/reviews/bulk/status', { review_ids, status }),
};

export const returnsAPI = {
  getAll: (params) => apiClient.get('/returns', { params }),
  getStats: () => apiClient.get('/returns/stats'),
  processRefund: (id) => apiClient.put(`/returns/${id}/refund`),
  cancelRefund: (id) => apiClient.put(`/returns/${id}/cancel`),
};

export const customersAPI = {
  getAll: (params) => apiClient.get('/admin/customers', { params }),
  getStats: () => apiClient.get('/admin/customers/stats'),
  getDetails: (id) => apiClient.get(`/admin/customers/${id}`),
  create: (data) => apiClient.post('/admin/customers', data),
  update: (id, data) => apiClient.put(`/admin/customers/${id}`, data),
  updateStatus: (id, status) => apiClient.put(`/admin/customers/${id}/status`, { status }),
};

export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  create: (data) => {
    console.log('🔐 Token from localStorage:', localStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
    console.log('📤 Sending category data:', data);
    return apiClient.post('/categories', data);
  },
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};
