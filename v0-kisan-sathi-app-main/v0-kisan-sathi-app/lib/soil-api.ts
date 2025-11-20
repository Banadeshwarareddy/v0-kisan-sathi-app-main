/**
 * SoilSense API Client
 * Connects to Django REST API backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api/soil';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kisan-sathi-access');
  }
  return null;
};

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    ...options.headers,
  };
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kisan-sathi-access');
      localStorage.removeItem('kisan-sathi-refresh');
      localStorage.removeItem('kisan-sathi-user');
      alert('Your session has expired. Please login again.');
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

// Soil Analysis API
export const soilApi = {
  // Analyze soil
  analyze: async (data: FormData) => {
    return apiRequest('/samples/analyze/', {
      method: 'POST',
      body: data,
    });
  },
  
  // Get all reports
  getReports: async () => {
    return apiRequest('/samples/reports/');
  },
  
  // Get dashboard summary
  getDashboard: async () => {
    return apiRequest('/dashboard/');
  },
  
  // Get soil health history
  getHistory: async () => {
    return apiRequest('/samples/history/');
  },
  
  // Get statistics
  getStats: async () => {
    return apiRequest('/samples/stats/');
  },
  
  // Download PDF report
  downloadPDF: async (sampleId: string) => {
    return apiRequest(`/samples/${sampleId}/download_pdf/`);
  },
  
  // Download audio report
  downloadAudio: async (sampleId: string) => {
    return apiRequest(`/samples/${sampleId}/download_audio/`);
  },
  
  // Submit feedback
  submitFeedback: async (data: any) => {
    return apiRequest('/feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Get regional statistics
  getRegionalStats: async (district?: string, taluk?: string) => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    return apiRequest(`/regional-stats/?${params.toString()}`);
  },
};
