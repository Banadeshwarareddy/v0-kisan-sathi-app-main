# Module Documentation

Complete guide to all Kisan Sathi modules.

## 1. Farm Management Module

Comprehensive farm operations management system.

### Features
- **Income Management** - Track all farm income sources
- **Expense Tracking** - Monitor and categorize expenses
- **Inventory System** - Manage seeds, fertilizers, equipment
- **Crop Planning** - Plan and track crop cycles
- **Livestock Management** - Track animals, health, vaccinations
- **Loan & EMI Tracking** - Manage agricultural loans

### Access
- **Django**: http://localhost:8000/farm-management/dashboard/
- **Next.js**: http://localhost:3000/farm-management

### API Endpoints
```
GET  /farm-management/api/dashboard-stats/
GET  /farm-management/api/income/
POST /farm-management/api/income/
GET  /farm-management/api/expenses/
POST /farm-management/api/expenses/
GET  /farm-management/api/inventory/
GET  /farm-management/api/crop-plans/
GET  /farm-management/api/livestock/
GET  /farm-management/api/loans/
```

### Key Files
- Backend: `kisan_sathi_backend/farm_management/`
- Frontend: `v0-kisan-sathi-app/components/farm-management/`

---

## 2. AI Soil Analyzer

Intelligent soil analysis with AI-powered recommendations.

### Features
- Soil parameter input (N, P, K, pH, etc.)
- AI-generated analysis and recommendations
- PDF report generation
- Voice output in multiple languages
- Historical analysis tracking

### Access
- **Next.js**: http://localhost:3000/soil-analysis

### API Endpoints
```
POST /soil-analysis/api/analyze/
GET  /soil-analysis/api/history/
GET  /soil-analysis/api/download-pdf/<id>/
```

### Usage Example
```javascript
const response = await fetch('/soil-analysis/api/analyze/', {
  method: 'POST',
  body: JSON.stringify({
    nitrogen: 40,
    phosphorus: 30,
    potassium: 20,
    ph: 6.5,
    // ... other parameters
  })
});
```

### Key Files
- Backend: `kisan_sathi_backend/soil_analysis/`
- Frontend: `v0-kisan-sathi-app/app/soil-analysis/`
- AI Engine: `kisan_sathi_backend/soil_analysis/ai_engine.py`

---

## 3. AI Crop Doctor

Image-based crop disease detection and treatment recommendations.

### Features
- Upload crop images
- AI disease detection
- Treatment recommendations
- Severity assessment
- Prevention tips

### Access
- **Next.js**: http://localhost:3000/crop-doctor

### API Endpoints
```
POST /crop-doctor/api/analyze/
GET  /crop-doctor/api/history/
```

### Usage Example
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/crop-doctor/api/analyze/', {
  method: 'POST',
  body: formData
});
```

### Key Files
- Frontend: `v0-kisan-sathi-app/app/crop-doctor/`

---

## 4. Marketplace

Agricultural product marketplace for buying and selling.

### Features
- Product listings with images
- Shopping cart
- Order management
- Buyer & seller dashboards
- Wishlist functionality
- Search and filters

### Access
- **Django**: http://localhost:8000/marketplace/
- **Next.js**: http://localhost:3000/marketplace

### API Endpoints
```
GET  /marketplace/api/products/
POST /marketplace/api/products/
GET  /marketplace/api/cart/
POST /marketplace/api/cart/add/
POST /marketplace/api/orders/
GET  /marketplace/api/orders/
```

### User Roles
- **Farmers**: Can sell products
- **Buyers**: Can purchase products
- **Both**: Can browse and search

### Key Files
- Backend: `kisan_sathi_backend/marketplace/`
- Frontend: `v0-kisan-sathi-app/app/marketplace/`

---

## 5. Expert Chatbot

Multi-language AI chatbot for farming advice.

### Features
- Natural language conversations
- Multi-language support (English, Hindi, Marathi, etc.)
- Voice input/output
- Context-aware responses
- Farming expertise

### Access
- **Next.js**: http://localhost:3000/chatbot

### API Endpoints
```
POST /chatbot/api/chat/
GET  /chatbot/api/history/
```

### Supported Languages
- English
- Hindi
- Marathi
- Punjabi
- Tamil
- Telugu
- Bengali

### Key Files
- Backend: `kisan_sathi_backend/chatbot/`
- Frontend: `v0-kisan-sathi-app/app/chatbot/`
- System Prompt: `kisan_sathi_backend/chatbot/expert_system_prompt.py`

---

## 6. Government Schemes

Access to agricultural schemes and subsidies.

### Features
- Browse government schemes
- Filter by category and state
- Detailed scheme information
- Eligibility criteria
- Application links

### Access
- **Django**: http://localhost:8000/schemes/

### API Endpoints
```
GET /schemes/api/list/
GET /schemes/api/detail/<id>/
```

### Key Files
- Backend: `kisan_sathi_backend/schemes/`

---

## 7. Weather Integration

Real-time weather information for farmers.

### Features
- Current weather conditions
- 7-day forecast
- Location-based weather
- Agricultural weather alerts

### Access
- **Next.js**: http://localhost:3000/weather

### Key Files
- Frontend: `v0-kisan-sathi-app/app/weather/`

---

## 8. User Management

Authentication and user profile management.

### Features
- User registration
- Login/logout
- Profile management
- Role-based access control
- JWT authentication

### API Endpoints
```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/logout/
GET  /api/auth/profile/
PUT  /api/auth/profile/
```

### User Types
- Farmer
- Buyer
- Admin

### Key Files
- Backend: `kisan_sathi_backend/farmers/`
- Frontend: `v0-kisan-sathi-app/components/auth-context.tsx`

---

## Module Integration

All modules are integrated through:
- Shared authentication system
- Common API structure
- Unified UI/UX
- Centralized data management

## Adding New Modules

1. Create Django app: `python manage.py startapp module_name`
2. Add to `INSTALLED_APPS` in settings.py
3. Create models, views, serializers
4. Add URL patterns
5. Create Next.js pages and components
6. Update navigation

## Module Dependencies

```
farm_management → farmers (auth)
marketplace → farmers (auth)
soil_analysis → farmers (auth)
chatbot → farmers (auth)
schemes → (standalone)
weather → (standalone)
```
