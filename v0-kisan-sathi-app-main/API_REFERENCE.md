# API Reference

Complete API documentation for Kisan Sathi backend.

## Base URL

```
Development: http://localhost:8000
Production: https://api.kisansathi.com
```

## Authentication

All authenticated endpoints require JWT token in header:

```http
Authorization: Bearer <your_jwt_token>
```

### Get Token

```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "farmer1",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "farmer1",
    "email": "farmer@example.com"
  }
}
```

---

## Farm Management API

### Dashboard Stats

```http
GET /farm-management/api/dashboard-stats/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_income": "150000.00",
  "total_expenses": "80000.00",
  "net_profit": "70000.00",
  "active_loans": 2
}
```

### Income

#### List Income
```http
GET /farm-management/api/income/
Authorization: Bearer <token>
```

#### Create Income
```http
POST /farm-management/api/income/
Authorization: Bearer <token>
Content-Type: application/json

{
  "source": "Crop Sale",
  "amount": 25000,
  "date": "2025-11-20",
  "description": "Wheat harvest sale"
}
```

### Expenses

#### List Expenses
```http
GET /farm-management/api/expenses/
Authorization: Bearer <token>
```

#### Create Expense
```http
POST /farm-management/api/expenses/
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Seeds",
  "amount": 5000,
  "date": "2025-11-15",
  "description": "Wheat seeds purchase"
}
```

### Inventory

#### List Inventory
```http
GET /farm-management/api/inventory/
Authorization: Bearer <token>
```

#### Add Inventory Item
```http
POST /farm-management/api/inventory/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fertilizer NPK",
  "category": "Fertilizer",
  "current_stock": 100,
  "unit": "kg",
  "min_stock_level": 20
}
```

### Crop Planning

#### List Crop Plans
```http
GET /farm-management/api/crop-plans/
Authorization: Bearer <token>
```

#### Create Crop Plan
```http
POST /farm-management/api/crop-plans/
Authorization: Bearer <token>
Content-Type: application/json

{
  "crop_name": "Wheat",
  "planned_area": 5,
  "area_unit": "acres",
  "planting_date": "2025-12-01",
  "expected_harvest_date": "2026-04-01",
  "status": "planned"
}
```

### Livestock

#### List Livestock
```http
GET /farm-management/api/livestock/
Authorization: Bearer <token>
```

#### Add Livestock
```http
POST /farm-management/api/livestock/
Authorization: Bearer <token>
Content-Type: application/json

{
  "animal_type": "Cow",
  "tag_number": "COW-001",
  "breed": "Holstein",
  "date_of_birth": "2023-01-15",
  "health_status": "Healthy"
}
```

---

## Soil Analysis API

### Analyze Soil

```http
POST /soil-analysis/api/analyze/
Authorization: Bearer <token>
Content-Type: application/json

{
  "nitrogen": 40,
  "phosphorus": 30,
  "potassium": 20,
  "ph": 6.5,
  "organic_carbon": 0.8,
  "sulfur": 15,
  "zinc": 1.2,
  "iron": 5.0,
  "copper": 0.5,
  "manganese": 3.0,
  "boron": 0.8,
  "location": "Punjab, India",
  "crop_type": "Wheat"
}
```

**Response:**
```json
{
  "id": 123,
  "analysis": "Your soil shows moderate nitrogen levels...",
  "recommendations": "1. Add organic compost...",
  "soil_health_score": 75,
  "created_at": "2025-11-20T10:30:00Z"
}
```

### Analysis History

```http
GET /soil-analysis/api/history/
Authorization: Bearer <token>
```

### Download PDF Report

```http
GET /soil-analysis/api/download-pdf/<analysis_id>/
Authorization: Bearer <token>
```

---

## Marketplace API

### Products

#### List Products
```http
GET /marketplace/api/products/
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search products
- `min_price` - Minimum price
- `max_price` - Maximum price

#### Create Product (Farmers only)
```http
POST /marketplace/api/products/
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Organic Wheat",
  "description": "Fresh organic wheat",
  "price": 2500,
  "unit": "quintal",
  "stock_quantity": 100,
  "category": "Grains",
  "image": <file>
}
```

### Cart

#### Get Cart
```http
GET /marketplace/api/cart/
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /marketplace/api/cart/add/
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 5,
  "quantity": 2
}
```

#### Remove from Cart
```http
DELETE /marketplace/api/cart/remove/<item_id>/
Authorization: Bearer <token>
```

### Orders

#### Create Order
```http
POST /marketplace/api/orders/
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address": "123 Farm Road, Village",
  "payment_method": "COD"
}
```

#### List Orders
```http
GET /marketplace/api/orders/
Authorization: Bearer <token>
```

---

## Chatbot API

### Send Message

```http
POST /chatbot/api/chat/
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I treat wheat rust disease?",
  "language": "en"
}
```

**Response:**
```json
{
  "response": "Wheat rust disease can be treated by...",
  "language": "en"
}
```

### Chat History

```http
GET /chatbot/api/history/
Authorization: Bearer <token>
```

---

## Government Schemes API

### List Schemes

```http
GET /schemes/api/list/
```

**Query Parameters:**
- `category` - Filter by category
- `state` - Filter by state

### Scheme Details

```http
GET /schemes/api/detail/<scheme_id>/
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "details": {
    "field_name": ["Error message"]
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

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour

## Pagination

List endpoints support pagination:

```http
GET /api/endpoint/?page=2&page_size=20
```

**Response:**
```json
{
  "count": 100,
  "next": "http://api.example.com/api/endpoint/?page=3",
  "previous": "http://api.example.com/api/endpoint/?page=1",
  "results": [...]
}
```

## CORS

CORS is enabled for:
- `http://localhost:3000` (development)
- `https://kisansathi.com` (production)
