# Soft Delete & Restore Implementation Guide

## ✅ Completed Backend Changes

### 1. Models Updated (farm_management/models.py)
Added to both `Expense` and `Income` models:
```python
is_deleted = models.BooleanField(default=False)
deleted_at = models.DateTimeField(null=True, blank=True)
```

### 2. Migrations Created and Applied
- Migration file: `0002_auto_20251104_0106.py`
- Status: ✅ Applied successfully

### 3. ViewSets Enhanced (farm_management/views.py)

#### ExpenseViewSet - New Methods:
- `destroy()` - Soft delete (marks is_deleted=True)
- `restore()` - Restore deleted expense (POST/PATCH to `/api/expenses/{id}/restore/`)
- `history()` - Get deleted expenses (GET `/api/expenses/history/`)
- `summary()` - Now includes `deleted_count`

#### IncomeViewSet - New Methods:
- `destroy()` - Soft delete (marks is_deleted=True)
- `restore()` - Restore deleted income (POST/PATCH to `/api/income/{id}/restore/`)
- `history()` - Get deleted income (GET `/api/income/history/`)
- `summary()` - Now includes `deleted_count`

### 4. Serializers Updated
- Added `is_deleted` and `deleted_at` to read_only_fields

## 📡 API Endpoints

### Expense Endpoints
```
GET    /farm-management/api/expenses/              # List active expenses
POST   /farm-management/api/expenses/              # Create expense
GET    /farm-management/api/expenses/{id}/         # Get expense detail
PUT    /farm-management/api/expenses/{id}/         # Update expense
DELETE /farm-management/api/expenses/{id}/         # Soft delete expense
PATCH  /farm-management/api/expenses/{id}/restore/ # Restore expense
GET    /farm-management/api/expenses/history/      # List deleted expenses
GET    /farm-management/api/expenses/summary/      # Get summary with counts
```

### Income Endpoints
```
GET    /farm-management/api/income/              # List active income
POST   /farm-management/api/income/              # Create income
GET    /farm-management/api/income/{id}/         # Get income detail
PUT    /farm-management/api/income/{id}/         # Update income
DELETE /farm-management/api/income/{id}/         # Soft delete income
PATCH  /farm-management/api/income/{id}/restore/ # Restore income
GET    /farm-management/api/income/history/      # List deleted income
GET    /farm-management/api/income/summary/      # Get summary with counts
```

## 🔧 Frontend Integration

### JavaScript Utility File Created
Location: `farm_management/static/farm_management/js/soft-delete.js`

### Available Functions:

#### Delete Functions
```javascript
// Delete expense with confirmation
deleteExpense(expenseId, onSuccessCallback)

// Delete income with confirmation
deleteIncome(incomeId, onSuccessCallback)
```

#### Restore Functions
```javascript
// Restore expense
restoreExpense(expenseId, onSuccessCallback)

// Restore income
restoreIncome(incomeId, onSuccessCallback)
```

#### Data Loading Functions
```javascript
// Load deleted expenses
loadExpenseHistory()

// Load deleted income
loadIncomeHistory()

// Get expense summary (includes deleted_count)
getExpenseSummary()

// Get income summary (includes deleted_count)
getIncomeSummary()
```

#### Utility Functions
```javascript
// Show toast notification
showToast(message, type) // type: 'success', 'error', 'warning'

// Fetch with JWT authentication
fetchWithAuth(url, options)

// Get auth token
getAuthToken()
```

## 💻 Frontend HTML Implementation

### Step 1: Include the JavaScript file
```html
{% load static %}
<script src="{% static 'farm_management/js/soft-delete.js' %}"></script>
```

### Step 2: Add Tabs for Active/History Views
```html
<div class="tabs">
    <button class="tab active" onclick="showTab('active')">
        Active Expenses
        <span class="tab-badge" id="activeCount">0</span>
    </button>
    <button class="tab" onclick="showTab('history')">
        History
        <span class="tab-badge" id="deletedCount">0</span>
    </button>
</div>

<div id="activeTab" class="tab-content active">
    <!-- Active expenses list -->
</div>

<div id="historyTab" class="tab-content">
    <!-- Deleted expenses list -->
</div>
```

### Step 3: Add Delete Button to Expense Cards
```html
<div class="expense-card" data-expense-id="${expense.id}">
    <div class="expense-details">
        <h3>${expense.category_name}</h3>
        <p>Amount: ₹${expense.amount}</p>
        <p>Date: ${expense.date}</p>
    </div>
    <div class="expense-actions">
        <button class="btn btn-danger btn-sm" 
                onclick="deleteExpense(${expense.id}, loadExpenses)"
                title="Delete (Soft)">
            🗑️ Delete
        </button>
    </div>
</div>
```

### Step 4: Add Restore Button in History View
```html
<div class="expense-card deleted" data-expense-id="${expense.id}">
    <div class="expense-details">
        <h3>${expense.category_name}</h3>
        <p>Amount: ₹${expense.amount}</p>
        <p>Deleted: ${new Date(expense.deleted_at).toLocaleString()}</p>
    </div>
    <div class="expense-actions">
        <button class="btn btn-success btn-sm" 
                onclick="restoreExpense(${expense.id}, loadHistory)"
                title="Restore">
            ↩️ Restore
        </button>
    </div>
</div>
```

### Step 5: Tab Switching Logic
```javascript
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    if (tabName === 'active') {
        document.getElementById('activeTab').classList.add('active');
        document.querySelector('.tab:first-child').classList.add('active');
        loadExpenses();
    } else {
        document.getElementById('historyTab').classList.add('active');
        document.querySelector('.tab:last-child').classList.add('active');
        loadHistory();
    }
}
```

### Step 6: Load and Display Functions
```javascript
async function loadExpenses() {
    const response = await fetchWithAuth(`${API_BASE}/expenses/`);
    const expenses = await response.json();
    
    const container = document.getElementById('expensesList');
    container.innerHTML = expenses.map(expense => `
        <div class="expense-card" data-expense-id="${expense.id}">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <h3>${expense.category_name}</h3>
                    <p><strong>Amount:</strong> ₹${parseFloat(expense.amount).toLocaleString('en-IN')}</p>
                    <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString('en-IN')}</p>
                    ${expense.notes ? `<p><strong>Notes:</strong> ${expense.notes}</p>` : ''}
                </div>
                <div>
                    <button class="btn btn-danger btn-sm" 
                            onclick="deleteExpense(${expense.id}, loadExpenses)"
                            title="Delete (Soft)">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update counts
    const summary = await getExpenseSummary();
    document.getElementById('activeCount').textContent = summary.expense_count;
    document.getElementById('deletedCount').textContent = summary.deleted_count;
}

async function loadHistory() {
    const expenses = await loadExpenseHistory();
    
    const container = document.getElementById('historyList');
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No deleted expenses</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = expenses.map(expense => `
        <div class="expense-card deleted" data-expense-id="${expense.id}">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <h3>${expense.category_name}</h3>
                    <p><strong>Amount:</strong> ₹${parseFloat(expense.amount).toLocaleString('en-IN')}</p>
                    <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString('en-IN')}</p>
                    <p><strong>Deleted:</strong> ${new Date(expense.deleted_at).toLocaleString('en-IN')}</p>
                    ${expense.notes ? `<p><strong>Notes:</strong> ${expense.notes}</p>` : ''}
                </div>
                <div>
                    <button class="btn btn-success btn-sm" 
                            onclick="restoreExpense(${expense.id}, loadHistory)"
                            title="Restore">
                        ↩️ Restore
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
```

## 🧪 Testing

### Test Delete Expense
```bash
curl -X DELETE http://127.0.0.1:8000/farm-management/api/expenses/1/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
    "success": true,
    "message": "Expense deleted successfully"
}
```

### Test Restore Expense
```bash
curl -X PATCH http://127.0.0.1:8000/farm-management/api/expenses/1/restore/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

Expected Response:
```json
{
    "success": true,
    "message": "Expense restored successfully",
    "data": { ... }
}
```

### Test Get History
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/history/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
    "success": true,
    "data": [ ... ],
    "count": 5
}
```

### Test Summary
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/summary/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
    "total_expenses": "15000.00",
    "expense_count": 10,
    "deleted_count": 3
}
```

## 🔒 Security Features

1. **JWT Authentication Required**: All endpoints require valid JWT token
2. **User Ownership**: Users can only delete/restore their own records
3. **Soft Delete**: Records never permanently deleted from database
4. **Audit Trail**: `deleted_at` timestamp tracks when deletion occurred

## 🎨 UX Features

1. **Confirmation Dialogs**: Asks "Are you sure?" before delete
2. **Toast Notifications**: Shows success/error messages
3. **Fade Animations**: Smooth fade-out when deleting/restoring
4. **Badge Counts**: Shows active and deleted item counts
5. **History Tab**: Separate view for deleted items
6. **Restore Capability**: Easy one-click restore

## 📝 Same Implementation for Income Module

All the above applies identically to Income module. Just replace:
- `expense` → `income`
- `deleteExpense` → `deleteIncome`
- `restoreExpense` → `restoreIncome`
- `loadExpenseHistory` → `loadIncomeHistory`
- `getExpenseSummary` → `getIncomeSummary`

## 🚀 Next Steps

1. Restart Django server to apply changes
2. Include soft-delete.js in your HTML templates
3. Add tabs and delete/restore buttons to UI
4. Test with sample data
5. Customize styling as needed

## ✨ Features Summary

✅ Soft delete (never lose data)
✅ Restore functionality
✅ History view
✅ Badge counts
✅ Toast notifications
✅ Fade animations
✅ JWT authentication
✅ User ownership validation
✅ Confirmation dialogs
✅ Production-ready code
