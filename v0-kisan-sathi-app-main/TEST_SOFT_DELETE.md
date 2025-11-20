# Testing Soft Delete & Restore Functionality

## ✅ Setup Complete

All backend changes have been implemented and migrations applied successfully.

## 🧪 Manual Testing Steps

### 1. Login and Get Token
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "password": "test123"}'
```

Save the `access_token` from the response.

### 2. Create Test Expense
```bash
curl -X POST http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": 1,
    "amount": 5000,
    "date": "2024-11-04",
    "notes": "Test expense for soft delete"
  }'
```

Note the `id` from the response (e.g., id: 1).

### 3. List Active Expenses
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should show the expense you just created.

### 4. Get Summary (Before Delete)
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/summary/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should show:
```json
{
    "total_expenses": "5000.00",
    "expense_count": 1,
    "deleted_count": 0
}
```

### 5. Soft Delete the Expense
```bash
curl -X DELETE http://127.0.0.1:8000/farm-management/api/expenses/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
    "success": true,
    "message": "Expense deleted successfully"
}
```

### 6. List Active Expenses Again
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return empty array `[]` - expense is hidden from active list.

### 7. Get History (Deleted Expenses)
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/history/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should show the deleted expense with `is_deleted: true` and `deleted_at` timestamp.

### 8. Get Summary (After Delete)
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/summary/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should show:
```json
{
    "total_expenses": "0.00",
    "expense_count": 0,
    "deleted_count": 1
}
```

### 9. Restore the Expense
```bash
curl -X PATCH http://127.0.0.1:8000/farm-management/api/expenses/1/restore/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
    "success": true,
    "message": "Expense restored successfully",
    "data": { ... }
}
```

### 10. List Active Expenses Again
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should show the expense again - it's been restored!

### 11. Get History Again
```bash
curl -X GET http://127.0.0.1:8000/farm-management/api/expenses/history/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return empty - expense is no longer in deleted state.

## 🎯 Testing with Frontend

1. Open `SOFT_DELETE_EXAMPLE.html` in your browser
2. Make sure you're logged in (JWT token in localStorage)
3. You should see:
   - Statistics showing active and deleted counts
   - Two tabs: "Active Expenses" and "History"
   - Delete button on each expense card
   - Restore button on deleted expenses in History tab

### Test Flow:
1. Click "Delete" on an expense
2. Confirm the deletion
3. See toast notification
4. Watch the card fade out
5. See updated counts in badges
6. Switch to "History" tab
7. See the deleted expense
8. Click "Restore"
9. Confirm restoration
10. See toast notification
11. Switch back to "Active Expenses"
12. See the restored expense

## 🔍 Database Verification

Check the database directly:

```bash
cd kisan_sathi_backend
venv\Scripts\activate
python manage.py shell
```

```python
from farm_management.models import Expense
from farmers.models import Farmer

# Get a farmer
farmer = Farmer.objects.first()

# Create test expense
expense = Expense.objects.create(
    farmer=farmer,
    category_id=1,
    amount=1000,
    date='2024-11-04',
    notes='Test expense'
)
print(f"Created expense {expense.id}")

# Soft delete
expense.is_deleted = True
from django.utils import timezone
expense.deleted_at = timezone.now()
expense.save()
print(f"Soft deleted expense {expense.id}")

# Check it's hidden from active query
active = Expense.objects.filter(farmer=farmer, is_deleted=False)
print(f"Active expenses: {active.count()}")

# Check it's in deleted query
deleted = Expense.objects.filter(farmer=farmer, is_deleted=True)
print(f"Deleted expenses: {deleted.count()}")

# Restore
expense.is_deleted = False
expense.deleted_at = None
expense.save()
print(f"Restored expense {expense.id}")

# Verify restoration
active = Expense.objects.filter(farmer=farmer, is_deleted=False)
print(f"Active expenses after restore: {active.count()}")
```

## ✅ Expected Results

All tests should pass with:
- ✅ Expenses soft deleted (not removed from DB)
- ✅ Deleted expenses hidden from active list
- ✅ Deleted expenses visible in history
- ✅ Restore functionality working
- ✅ Counts updating correctly
- ✅ Toast notifications showing
- ✅ Fade animations working
- ✅ JWT authentication enforced
- ✅ User can only access their own records

## 🎉 Success Criteria

If all the above tests pass, your soft delete implementation is production-ready!

## 📝 Same Tests Apply to Income Module

Replace `/expenses/` with `/income/` in all the above curl commands to test the Income module.
