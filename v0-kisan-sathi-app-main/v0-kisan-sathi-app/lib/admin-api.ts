// Admin API functions for connecting to Django backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Admin API functions
export const adminApi = {
  // Get dashboard statistics
  getStats: async () => {
    return apiCall('/farmers/admin/stats/');
  },

  // Get all users with optional filters
  getUsers: async (filters?: { role?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    return apiCall(`/farmers/admin/users/${queryString ? `?${queryString}` : ''}`);
  },

  // Get user activity data
  getActivity: async () => {
    return apiCall('/farmers/admin/activity/');
  },

  // Get specific user details
  getUserDetail: async (userId: number) => {
    return apiCall(`/farmers/admin/users/${userId}/`);
  },

  // Update user
  updateUser: async (userId: number, data: any) => {
    return apiCall(`/farmers/admin/users/${userId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete user
  deleteUser: async (userId: number) => {
    return apiCall(`/farmers/admin/users/${userId}/`, {
      method: 'DELETE',
    });
  },
};

// Export types
export interface AdminStats {
  total_users: number;
  active_users: number;
  farmers_count: number;
  buyers_count: number;
  new_signups_today: number;
  active_today: number;
  total_transactions: number;
  revenue: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  district: string;
  village: string;
  role: 'farmer' | 'buyer';
  joinDate: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  loginCount: number;
  is_verified: boolean;
}

export interface UserActivity {
  stats: {
    logins_today: number;
    signups_today: number;
    active_now: number;
    avg_session_time: number;
  };
  recent_logins: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
    status: string;
    loginCount: number;
  }>;
  recent_signups: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    joinDate: string;
    district: string;
  }>;
}
