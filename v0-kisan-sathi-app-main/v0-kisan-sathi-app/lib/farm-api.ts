// Farm Management API Configuration and Helper Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
export const FARM_API_BASE = `${API_BASE_URL}/farm-management/api`

// Helper function to get auth headers
export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('kisan-sathi-access') : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Helper function for authenticated fetch
export async function farmApiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${FARM_API_BASE}${endpoint}`
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kisan-sathi-access')
      localStorage.removeItem('kisan-sathi-refresh')
      localStorage.removeItem('kisan-sathi-user')
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
    }
    throw new Error('Authentication required. Please login again.')
  }
  
  return response
}

// API endpoints
export const farmApi = {
  // Dashboard
  getDashboardStats: () => farmApiFetch('/dashboard-stats/'),
  getMonthlyProfit: () => farmApiFetch('/monthly-profit/'),
  getExpenseByCategory: () => farmApiFetch('/expense-by-category/'),
  getIncomeByCrop: () => farmApiFetch('/income-by-crop/'),
  getRecentActivity: () => farmApiFetch('/recent-activity/'),
  
  // Expenses
  getExpenses: (params?: string) => farmApiFetch(`/expenses/${params || ''}`),
  createExpense: (data: any) => farmApiFetch('/expenses/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateExpense: (id: number, data: any) => farmApiFetch(`/expenses/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteExpense: (id: number) => farmApiFetch(`/expenses/${id}/`, {
    method: 'DELETE',
  }),
  getExpenseCategories: () => farmApiFetch('/expense-categories/'),
  
  // Income
  getIncome: (params?: string) => farmApiFetch(`/income/${params || ''}`),
  createIncome: (data: any) => farmApiFetch('/income/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateIncome: (id: number, data: any) => farmApiFetch(`/income/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteIncome: (id: number) => farmApiFetch(`/income/${id}/`, {
    method: 'DELETE',
  }),
  getCrops: () => farmApiFetch('/crops/'),
  
  // Inventory
  getInventory: (params?: string) => farmApiFetch(`/inventory/${params || ''}`),
  createInventoryItem: (data: any) => farmApiFetch('/inventory/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateInventoryItem: (id: number, data: any) => farmApiFetch(`/inventory/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteInventoryItem: (id: number) => farmApiFetch(`/inventory/${id}/`, {
    method: 'DELETE',
  }),
  getInventoryCategories: () => farmApiFetch('/inventory-categories/'),
  getLowStock: () => farmApiFetch('/inventory/low_stock/'),
  
  // Crop Planning
  getCropPlans: (params?: string) => farmApiFetch(`/crop-plans/${params || ''}`),
  createCropPlan: (data: any) => farmApiFetch('/crop-plans/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCropPlan: (id: number, data: any) => farmApiFetch(`/crop-plans/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCropPlan: (id: number) => farmApiFetch(`/crop-plans/${id}/`, {
    method: 'DELETE',
  }),
  
  // Livestock
  getLivestock: (params?: string) => farmApiFetch(`/livestock/${params || ''}`),
  createLivestock: (data: any) => farmApiFetch('/livestock/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLivestock: (id: number, data: any) => farmApiFetch(`/livestock/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLivestock: (id: number) => farmApiFetch(`/livestock/${id}/`, {
    method: 'DELETE',
  }),
  getLivestockTypes: () => farmApiFetch('/livestock-types/'),
  getVaccinations: (params?: string) => farmApiFetch(`/vaccinations/${params || ''}`),
  getUpcomingVaccinations: () => farmApiFetch('/vaccinations/upcoming/'),
  
  // Loans
  getLoans: (params?: string) => farmApiFetch(`/loans/${params || ''}`),
  createLoan: (data: any) => farmApiFetch('/loans/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLoan: (id: number, data: any) => farmApiFetch(`/loans/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLoan: (id: number) => farmApiFetch(`/loans/${id}/`, {
    method: 'DELETE',
  }),
  getEMIPayments: (loanId: number) => farmApiFetch(`/emi-payments/?loan=${loanId}`),
}
