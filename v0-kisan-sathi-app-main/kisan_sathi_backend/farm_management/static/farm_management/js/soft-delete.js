/**
 * Soft Delete and Restore Utility for Kisan Sathi Farm Management
 * Handles delete, restore, and history functionality for Expense and Income modules
 */

const API_BASE = 'http://127.0.0.1:8000/farm-management/api';

// Get JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('kisan-sathi-access') || '';
}

// Fetch with authentication
async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    
    return response;
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
            display: none;
        `;
        document.body.appendChild(toast);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#f39c12';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    }, 3000);
}

// Soft delete expense
async function deleteExpense(expenseId, onSuccess) {
    if (!confirm('Are you sure you want to delete this expense? You can restore it later from History.')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/expenses/${expenseId}/`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success || response.ok) {
            showToast('Expense deleted successfully. Check History to restore.');
            
            // Fade out animation
            const expenseElement = document.querySelector(`[data-expense-id="${expenseId}"]`);
            if (expenseElement) {
                expenseElement.style.transition = 'opacity 0.3s ease-out';
                expenseElement.style.opacity = '0';
                setTimeout(() => {
                    expenseElement.remove();
                }, 300);
            }
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            showToast(result.message || 'Error deleting expense', 'error');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showToast('Error deleting expense', 'error');
    }
}

// Restore expense
async function restoreExpense(expenseId, onSuccess) {
    if (!confirm('Restore this expense?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/expenses/${expenseId}/restore/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Expense restored successfully');
            
            // Fade out from history
            const expenseElement = document.querySelector(`[data-expense-id="${expenseId}"]`);
            if (expenseElement) {
                expenseElement.style.transition = 'opacity 0.3s ease-out';
                expenseElement.style.opacity = '0';
                setTimeout(() => {
                    expenseElement.remove();
                }, 300);
            }
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            showToast(result.message || 'Error restoring expense', 'error');
        }
    } catch (error) {
        console.error('Error restoring expense:', error);
        showToast('Error restoring expense', 'error');
    }
}

// Soft delete income
async function deleteIncome(incomeId, onSuccess) {
    if (!confirm('Are you sure you want to delete this income record? You can restore it later from History.')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/income/${incomeId}/`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success || response.ok) {
            showToast('Income deleted successfully. Check History to restore.');
            
            // Fade out animation
            const incomeElement = document.querySelector(`[data-income-id="${incomeId}"]`);
            if (incomeElement) {
                incomeElement.style.transition = 'opacity 0.3s ease-out';
                incomeElement.style.opacity = '0';
                setTimeout(() => {
                    incomeElement.remove();
                }, 300);
            }
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            showToast(result.message || 'Error deleting income', 'error');
        }
    } catch (error) {
        console.error('Error deleting income:', error);
        showToast('Error deleting income', 'error');
    }
}

// Restore income
async function restoreIncome(incomeId, onSuccess) {
    if (!confirm('Restore this income record?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/income/${incomeId}/restore/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Income restored successfully');
            
            // Fade out from history
            const incomeElement = document.querySelector(`[data-income-id="${incomeId}"]`);
            if (incomeElement) {
                incomeElement.style.transition = 'opacity 0.3s ease-out';
                incomeElement.style.opacity = '0';
                setTimeout(() => {
                    incomeElement.remove();
                }, 300);
            }
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            showToast(result.message || 'Error restoring income', 'error');
        }
    } catch (error) {
        console.error('Error restoring income:', error);
        showToast('Error restoring income', 'error');
    }
}

// Load expense history
async function loadExpenseHistory() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/expenses/history/`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading expense history:', error);
        return [];
    }
}

// Load income history
async function loadIncomeHistory() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/income/history/`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Error loading income history:', error);
        return [];
    }
}

// Get summary with deleted counts
async function getExpenseSummary() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/expenses/summary/`);
        return await response.json();
    } catch (error) {
        console.error('Error loading expense summary:', error);
        return { expense_count: 0, deleted_count: 0, total_expenses: 0 };
    }
}

async function getIncomeSummary() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/income/summary/`);
        return await response.json();
    } catch (error) {
        console.error('Error loading income summary:', error);
        return { income_count: 0, deleted_count: 0, total_income: 0 };
    }
}
