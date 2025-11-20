# Farm Management Module

A comprehensive farm management system for the Kisan Sathi platform that helps farmers track expenses, income, inventory, crop planning, livestock, and loans.

## Features

### 1. Expense Management
- Track farm expenses by category (Seeds, Fertilizers, Pesticides, Labor, etc.)
- Upload receipt images
- Filter and search expenses
- Monthly/yearly expense analysis

### 2. Income Management
- Record crop sales with buyer details
- Track payment status (Pending, Partial, Completed)
- Calculate profit margins
- Income analysis by crop type

### 3. Inventory Management
- Track seeds, fertilizers, pesticides, and other farm supplies
- Low stock alerts
- Expiry date tracking
- Supplier information management
- Stock value calculations

### 4. Crop Planning
- Plan crop cultivation with area and timeline
- Cost and revenue estimation
- Track crop status (Planned → Planted → Growing → Harvested)
- Profit analysis per crop plan

### 5. Livestock Management
- Maintain livestock records with health status
- Vaccination tracking and reminders
- Veterinary cost management
- Health status monitoring

### 6. Loan & EMI Management
- Track farm loans from various sources
- EMI payment history
- Outstanding amount tracking
- Interest calculations

### 7. Dashboard & Reports
- Monthly profit/loss charts
- Expense breakdown by category
- Financial summary reports
- Export to PDF/Excel (planned)

## Installation & Setup

### 1. Database Migration
```bash
# Activate virtual environment
venv\Scripts\activate

# Create and run migrations
python manage.py makemigrations farm_management
python manage.py migrate
```

### 2. Load Initial Data
```bash
# Load predefined categories and crop types
python manage.py loaddata farm_management/fixtures/initial_data.json
```

### 3. Create Superuser (if not already created)
```bash
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```

### 5. Access the Application
- Dashboard: http://localhost:8000/farm-management/
- Admin Panel: http://localhost:8000/admin/

## API Endpoints

### Expense Management
- `GET/POST /farm-management/api/expenses/` - List/Create expenses
- `GET/PUT/DELETE /farm-management/api/expenses/{id}/` - Retrieve/Update/Delete expense
- `GET /farm-management/api/expense-categories/` - List expense categories

### Income Management
- `GET/POST /farm-management/api/income/` - List/Create income records
- `GET/PUT/DELETE /farm-management/api/income/{id}/` - Retrieve/Update/Delete income

### Inventory Management
- `GET/POST /farm-management/api/inventory/` - List/Create inventory items
- `GET /farm-management/api/inventory/low_stock/` - Get low stock items
- `GET /farm-management/api/inventory-categories/` - List inventory categories

### Crop Planning
- `GET/POST /farm-management/api/crop-plans/` - List/Create crop plans
- `GET /farm-management/api/crops/` - List available crops

### Livestock Management
- `GET/POST /farm-management/api/livestock/` - List/Create livestock records
- `GET/POST /farm-management/api/vaccinations/` - List/Create vaccination records
- `GET /farm-management/api/vaccinations/upcoming/` - Get upcoming vaccinations

### Loan Management
- `GET/POST /farm-management/api/loans/` - List/Create loans
- `GET/POST /farm-management/api/emi-payments/` - List/Create EMI payments

### Dashboard & Analytics
- `GET /farm-management/api/dashboard-stats/` - Get dashboard statistics
- `GET /farm-management/api/monthly-profit/` - Get monthly profit data
- `GET /farm-management/api/expense-by-category/` - Get expense breakdown

## Database Schema

### Key Models
- **Expense**: Farm expense records with categories
- **Income**: Crop sale records with buyer information
- **InventoryItem**: Farm supplies and equipment tracking
- **CropPlan**: Crop cultivation planning and tracking
- **Livestock**: Animal records with health status
- **VaccinationRecord**: Vaccination history and schedules
- **Loan**: Loan information and EMI tracking
- **EMIPayment**: EMI payment history

## Frontend Features

### Responsive Design
- Bootstrap 5 for responsive UI
- Mobile-friendly interface
- Chart.js for data visualization

### Interactive Features
- Real-time form validation
- AJAX-based data loading
- Modal forms for quick data entry
- Filtering and search capabilities

### Dashboard Analytics
- Monthly profit/loss trends
- Expense category breakdown
- Low stock alerts
- Upcoming vaccination reminders

## Security Features

- User authentication required for all operations
- CSRF protection on all forms
- User-specific data isolation
- Input validation and sanitization

## Future Enhancements

1. **PDF/Excel Export**: Complete implementation of report exports
2. **SMS/Email Alerts**: Automated reminders for vaccinations and low stock
3. **Weather Integration**: Weather-based crop planning suggestions
4. **Market Price Integration**: Real-time crop price updates
5. **Mobile App**: React Native mobile application
6. **Offline Support**: PWA with offline data sync
7. **Advanced Analytics**: ML-based insights and predictions

## Dependencies

- Django 4.2+
- Django REST Framework
- Pillow (for image handling)
- Bootstrap 5
- Chart.js
- jQuery

## Support

For issues and feature requests, please contact the development team or create an issue in the project repository.