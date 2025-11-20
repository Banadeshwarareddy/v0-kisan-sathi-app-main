# Farm Management API Documentation

## Base URL
```
http://127.0.0.1:8000/farm-management/api/
```

## Authentication
All API endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 1. EXPENSE MANAGEMENT

### Add Expense
**POST** `/expenses/`

**Request Body:**
```json
{
  "category": 1,
  "amount": "5000.00",
  "date": "2025-11-03",
  "notes": "Purchased fertilizer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "id": 1,
    "category": 1,
    "category_name": "Fertilizer",
    "amount": "5000.00",
    "date": "2025-11-03",
    "notes": "Purchased fertilizer",
    "created_at": "2025-11-03T10:30:00Z"
  }
}
```

### List Expenses
**GET** `/expenses/`

**Query Parameters:**
- `category` - Filter by category ID
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `search` - Search in notes or category name

**Example:**
```
GET /expenses/?category=1&start_date=2025-01-01&end_date=2025-12-31
```

### Get Expense Summary
**GET** `/expenses/summary/`

**Response:**
```json
{
  "total_expenses": "50000.00",
  "expense_count": 25
}
```

### Get Expense Categories
**GET** `/expense-categories/`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Seeds",
    "description": "Crop seeds and planting materials"
  },
  {
    "id": 2,
    "name": "Fertilizers",
    "description": "Chemical and organic fertilizers"
  }
]
```

---

## 2. INCOME MANAGEMENT

### Record Income
**POST** `/income/`

**Request Body:**
```json
{
  "crop": 1,
  "quantity": "100.00",
  "unit": "kg",
  "rate_per_unit": "50.00",
  "buyer_name": "ABC Traders",
  "buyer_contact": "9876543210",
  "sale_date": "2025-11-03",
  "payment_status": "completed",
  "notes": "First harvest sale"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Income recorded successfully",
  "data": {
    "id": 1,
    "crop": 1,
    "crop_name": "Wheat",
    "quantity": "100.00",
    "unit": "kg",
    "rate_per_unit": "50.00",
    "total_amount": "5000.00",
    "buyer_name": "ABC Traders",
    "sale_date": "2025-11-03",
    "payment_status": "completed"
  }
}
```

### List Income
**GET** `/income/`

**Query Parameters:**
- `crop` - Filter by crop ID
- `start_date` - Filter from date
- `end_date` - Filter to date
- `search` - Search in buyer name or crop name
- `payment_status` - Filter by payment status (pending/partial/completed)

### Get Income Summary
**GET** `/income/summary/`

**Response:**
```json
{
  "total_income": "150000.00",
  "income_count": 15
}
```

### Get Crops List
**GET** `/crops/`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wheat",
    "variety": "HD-2967",
    "season": "rabi"
  }
]
```

---

## 3. INVENTORY MANAGEMENT

### Add Inventory Item
**POST** `/inventory/`

**Request Body:**
```json
{
  "category": 1,
  "name": "NPK Fertilizer",
  "brand": "Tata Chemicals",
  "current_stock": "50.00",
  "unit": "kg",
  "minimum_stock": "10.00",
  "cost_per_unit": "45.00",
  "supplier_name": "Agro Suppliers",
  "supplier_contact": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inventory item added successfully",
  "data": {
    "id": 1,
    "name": "NPK Fertilizer",
    "brand": "Tata Chemicals",
    "current_stock": "50.00",
    "unit": "kg",
    "minimum_stock": "10.00",
    "is_low_stock": false,
    "total_value": "2250.00"
  }
}
```

### List Inventory
**GET** `/inventory/`

**Query Parameters:**
- `category` - Filter by category ID
- `search` - Search in name or brand

### Get Low Stock Items
**GET** `/inventory/low_stock/`

**Response:**
```json
[
  {
    "id": 5,
    "name": "Pesticide XYZ",
    "current_stock": "5.00",
    "minimum_stock": "10.00",
    "is_low_stock": true
  }
]
```

### Use Stock
**POST** `/inventory/{id}/use_stock/`

**Request Body:**
```json
{
  "quantity": "5.00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Used 5.00 kg of NPK Fertilizer",
  "data": {
    "id": 1,
    "current_stock": "45.00"
  }
}
```

---

## 4. ANALYTICS & DASHBOARD

### Get Dashboard Stats
**GET** `/dashboard-stats/`

**Response:**
```json
{
  "total_income": "150000.00",
  "total_expenses": "80000.00",
  "net_profit": "70000.00",
  "active_loans": 2,
  "low_stock_items": 3,
  "upcoming_vaccinations": 1,
  "active_crop_plans": 4
}
```

### Get Monthly Profit Chart
**GET** `/monthly-profit/`

**Query Parameters:**
- `year` - Year for data (default: current year)

**Response:**
```json
[
  {
    "month": "January",
    "total_income": "12000.00",
    "total_expense": "8000.00",
    "profit": "4000.00"
  },
  {
    "month": "February",
    "total_income": "15000.00",
    "total_expense": "9000.00",
    "profit": "6000.00"
  }
]
```

### Get Expense by Category
**GET** `/expense-by-category/`

**Query Parameters:**
- `year` - Year for data (default: current year)

**Response:**
```json
[
  {
    "category": "Fertilizers",
    "total_amount": "25000.00",
    "percentage": 35.5
  },
  {
    "category": "Seeds",
    "total_amount": "18000.00",
    "percentage": 25.6
  }
]
```

---

## 5. CROP PLANNING

### Add Crop Plan
**POST** `/crop-plans/`

**Request Body:**
```json
{
  "crop": 1,
  "planned_area": "5.00",
  "area_unit": "acre",
  "planting_date": "2025-11-15",
  "expected_harvest_date": "2026-03-15",
  "estimated_yield": "2500.00",
  "estimated_cost": "30000.00",
  "estimated_revenue": "50000.00",
  "status": "planned",
  "notes": "Winter crop planning"
}
```

### List Crop Plans
**GET** `/crop-plans/`

---

## 6. LIVESTOCK MANAGEMENT

### Add Livestock
**POST** `/livestock/`

**Request Body:**
```json
{
  "livestock_type": 1,
  "tag_number": "COW-001",
  "breed": "Holstein",
  "age_months": 24,
  "weight": "450.00",
  "purchase_date": "2024-01-15",
  "purchase_price": "50000.00",
  "health_status": "healthy",
  "notes": "Purchased from local farm"
}
```

### List Livestock
**GET** `/livestock/`

### Add Vaccination Record
**POST** `/vaccinations/`

**Request Body:**
```json
{
  "livestock": 1,
  "vaccine_name": "FMD Vaccine",
  "vaccination_date": "2025-11-03",
  "next_due_date": "2026-05-03",
  "veterinarian": "Dr. Sharma",
  "cost": "500.00",
  "notes": "Annual vaccination"
}
```

### Get Upcoming Vaccinations
**GET** `/vaccinations/upcoming/`

---

## 7. LOAN MANAGEMENT

### Add Loan
**POST** `/loans/`

**Request Body:**
```json
{
  "lender_name": "State Bank of India",
  "loan_type": "crop_loan",
  "principal_amount": "100000.00",
  "interest_rate": "7.50",
  "loan_date": "2025-01-01",
  "tenure_months": 12,
  "emi_amount": "8800.00",
  "remaining_amount": "100000.00",
  "status": "active",
  "purpose": "Purchase of seeds and fertilizers"
}
```

### List Loans
**GET** `/loans/`

### Add EMI Payment
**POST** `/emi-payments/`

**Request Body:**
```json
{
  "loan": 1,
  "payment_date": "2025-11-05",
  "amount_paid": "8800.00",
  "principal_component": "7500.00",
  "interest_component": "1300.00",
  "payment_method": "bank_transfer",
  "transaction_reference": "TXN123456789"
}
```

---

## 8. EXPORT REPORTS

### Export Expenses PDF
**GET** `/export/expenses/pdf/`

**Query Parameters:**
- `start_date` - From date (optional)
- `end_date` - To date (optional)

**Response:** PDF file download

### Export Expenses Excel
**GET** `/export/expenses/excel/`

**Query Parameters:**
- `start_date` - From date (optional)
- `end_date` - To date (optional)

**Response:** Excel file download

### Export Income PDF
**GET** `/export/income/pdf/`

**Query Parameters:**
- `start_date` - From date (optional)
- `end_date` - To date (optional)

**Response:** PDF file download

### Export Income Excel
**GET** `/export/income/excel/`

**Query Parameters:**
- `start_date` - From date (optional)
- `end_date` - To date (optional)

**Response:** Excel file download

### Export Analytics PDF
**GET** `/export/analytics/pdf/`

**Query Parameters:**
- `year` - Year for report (default: current year)

**Response:** PDF file download with complete analytics

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid data provided",
  "errors": {
    "amount": ["This field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Data Validation Rules

### Expense
- `amount`: Required, must be > 0
- `date`: Required, valid date format
- `category`: Required, must exist

### Income
- `quantity`: Required, must be > 0
- `rate_per_unit`: Required, must be > 0
- `total_amount`: Auto-calculated (quantity × rate_per_unit)
- `buyer_name`: Required
- `sale_date`: Required

### Inventory
- `current_stock`: Required, must be >= 0
- `minimum_stock`: Optional, default 0
- `cost_per_unit`: Optional, default 0
- `total_value`: Auto-calculated (current_stock × cost_per_unit)

---

## Frontend Integration

### Example: Add Expense
```javascript
const addExpense = async (expenseData) => {
  const token = localStorage.getItem('token')
  const response = await fetch('http://127.0.0.1:8000/farm-management/api/expenses/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expenseData)
  })
  
  if (response.ok) {
    const result = await response.json()
    console.log(result.message)
    return result.data
  } else {
    throw new Error('Failed to add expense')
  }
}
```

### Example: Fetch Dashboard Stats
```javascript
const fetchStats = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch('http://127.0.0.1:8000/farm-management/api/dashboard-stats/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (response.ok) {
    const stats = await response.json()
    return stats
  }
}
```

---

## Notes

1. All monetary values are in Indian Rupees (₹)
2. All dates should be in YYYY-MM-DD format
3. Decimal values support up to 2 decimal places
4. File uploads (receipts, images) use multipart/form-data
5. All list endpoints support pagination (add `?page=1&page_size=10`)
6. Filtering and searching are case-insensitive
7. Export endpoints return file downloads directly

---

## Support

For issues or questions, contact the development team or refer to the main README.md file.
