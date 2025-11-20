/**
 * Marketplace API Client for Next.js
 * Connects to Django REST API backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api/marketplace';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Try both token keys for compatibility
    return localStorage.getItem('kisan-sathi-access') || localStorage.getItem('auth_token');
  }
  return null;
};

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle authentication errors
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      // Clear invalid tokens
      localStorage.removeItem('kisan-sathi-access');
      localStorage.removeItem('kisan-sathi-refresh');
      localStorage.removeItem('kisan-sathi-user');
      localStorage.removeItem('auth_token');
      
      // Show alert and redirect to login
      alert('Your session has expired. Please login again.');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    throw new Error('Authentication required. Please login.');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'API request failed');
  }
  
  return response.json();
}

// Products API
export const productsApi = {
  list: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/products/${params ? `?${params}` : ''}`);
  },
  get: (id: string) => apiRequest(`/products/${id}/`),
  featured: () => apiRequest('/products/featured/'),
  trending: () => apiRequest('/products/trending/'),
  reviews: (id: string) => apiRequest(`/products/${id}/reviews/`),
};

// Categories API
export const categoriesApi = {
  list: () => apiRequest('/categories/'),
  tree: () => apiRequest('/categories/tree/'),
};

// Cart API
export const cartApi = {
  list: () => apiRequest('/cart/'),
  summary: () => apiRequest('/cart/summary/'),
  add: (productId: string, quantity: number) =>
    apiRequest('/cart/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),
  update: (itemId: string, quantity: number) =>
    apiRequest(`/cart/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  remove: (itemId: string) =>
    apiRequest(`/cart/${itemId}/`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart/clear/', { method: 'POST' }),
};

// Orders API
export const ordersApi = {
  list: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/orders/${params ? `?${params}` : ''}`);
  },
  get: (id: string) => apiRequest(`/orders/${id}/`),
  create: (orderData: any) =>
    apiRequest('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  confirm: (id: string) =>
    apiRequest(`/orders/${id}/confirm/`, { method: 'POST' }),
  cancel: (id: string, reason: string) =>
    apiRequest(`/orders/${id}/cancel/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// Wishlist API
export const wishlistApi = {
  list: () => apiRequest('/wishlist/'),
  add: (productId: string, notes?: string) =>
    apiRequest('/wishlist/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, notes }),
    }),
  remove: (itemId: string) =>
    apiRequest(`/wishlist/${itemId}/`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  list: (productId?: string) => {
    const params = productId ? `?product_id=${productId}` : '';
    return apiRequest(`/reviews/${params}`);
  },
  create: (reviewData: any) =>
    apiRequest('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
};

// Delivery Addresses API
export const addressesApi = {
  list: () => apiRequest('/delivery-addresses/'),
  create: (addressData: any) =>
    apiRequest('/delivery-addresses/', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),
  update: (id: string, addressData: any) =>
    apiRequest(`/delivery-addresses/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }),
  delete: (id: string) =>
    apiRequest(`/delivery-addresses/${id}/`, { method: 'DELETE' }),
};

// Notifications API
export const notificationsApi = {
  list: () => apiRequest('/notifications/'),
  markRead: (id: string) =>
    apiRequest(`/notifications/${id}/mark_read/`, { method: 'POST' }),
  markAllRead: () =>
    apiRequest('/notifications/mark_all_read/', { method: 'POST' }),
};

// Coupons API
export const couponsApi = {
  list: () => apiRequest('/coupons/'),
  validate: (code: string) =>
    apiRequest('/coupons/validate/', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};
