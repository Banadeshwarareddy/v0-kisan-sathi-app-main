# Farm Management - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Backend (Django)
```bash
cd kisan_sathi_backend
venv\Scripts\activate
python manage.py runserver
```
✅ Backend running at: **http://127.0.0.1:8000**

### Step 2: Start Frontend (Next.js)
```bash
cd v0-kisan-sathi-app
npm run dev
```
✅ Frontend running at: **http://localhost:3000**

### Step 3: Access Farm Management
1. Open browser: **http://localhost:3000**
2. Login with your credentials
3. Click **"Farm Management"** (🌾 icon) in navigation

---

## 📋 Quick Feature Overview

### 1. Dashboard Tab
- View total income, expenses, and profit
- See monthly profit trends
- Check expense breakdown by category
- Download analytics report (PDF)

### 2. Expenses Tab
- Add new expense (category, amount, date, notes)
- View all expenses in a list
- See total expenses
- Download PDF or Excel report

### 3. Income Tab
- Record crop sales (crop, quantity, rate, buyer)
- Auto-calculates total amount
- Track payment status
- Download PDF or Excel report

### 4. Inventory Tab
- Add inventory items (seeds, fertilizers, etc.)
- Track stock levels
- Get low stock alerts (red border)
- View total inventory value

### 5. Crops Tab
- Plan crop cultivation
- Set planting and harvest dates
- Estimate costs and revenue
- Track crop status

### 6. Livestock Tab
- Add livestock records
- Track health status
- Record vaccinations
- Get vaccination reminders

### 7. Loans Tab
- Record farm loans
- Track EMI payments
- Monitor remaining amount
- View payment history

---

## 🎯 Common Tasks

### Add an Expense
1. Go to **Expenses** tab
2. Select category from dropdown
3. Enter amount and date
4. Add notes (optional)
5. Click **"Add Expense"**
6. ✅ Success! List refreshes automatically

### Record Income
1. Go to **Income** tab
2. Select crop from dropdown
3. Enter quantity and rate per unit
4. Enter buyer name
5. Select payment status
6. Click **"Record Income"**
7. ✅ Total amount calculated automatically!

### Check Low Stock Items
1. Go to **Inventory** tab
2. Look for items with **red border**
3. These items are below minimum stock level
4. ⚠️ Reorder needed!

### Download Reports
1. Go to any tab (Expenses/Income/Dashboard)
2. Click **"Download PDF"** or **"Download Excel"**
3. ✅ File downloads automatically!

---

## 🔑 API Quick Reference

### Base URL
```
http://127.0.0.1:8000/farm-management/api/
```

### Authentication
All requests need JWT token:
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### Key Endpoints
```
POST   /expenses/              # Add expense
GET    /expenses/              # List expenses
POST   /income/                # Record income
GET    /income/                # List income
GET    /dashboard-stats/       # Get analytics
GET    /inventory/low_stock/   # Low stock items
GET    /export/expenses/pdf/   # Download PDF
```

---

## 💡 Pro Tips

1. **Auto-Refresh**: Data refreshes automatically after adding/editing
2. **Search**: Use search box to find specific records
3. **Filters**: Filter by date range, category, status
4. **Calculations**: Totals and profits calculate automatically
5. **Alerts**: Red borders indicate low stock or issues
6. **Export**: Download reports anytime for record-keeping
7. **Mobile**: Works on mobile browsers too!

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Check if backend is running on port 8000
- Check if frontend is running on port 3000
- Refresh the page

### "Unauthorized" error
- Login again to get fresh token
- Check if token is expired

### Data not showing
- Ensure you're logged in
- Check browser console for errors
- Refresh the page

### Export not working
- Ensure you're logged in
- Check if backend has reportlab and openpyxl installed
- Try again after a few seconds

---

## 📊 Sample Data Flow

```
User Action → Frontend Form → API Request → Backend Validation 
→ Database Save → Success Response → UI Update → Toast Message
```

**Example: Adding Expense**
1. User fills form: Category=Seeds, Amount=5000
2. Frontend sends POST to `/api/expenses/`
3. Backend validates data
4. Saves to MySQL database
5. Returns success response
6. Frontend refreshes expense list
7. Shows "Expense added successfully!" message

---

## 🎨 UI Components

### Cards
- Summary cards show totals
- Color-coded (green=income, red=expense)
- Real-time updates

### Forms
- All required fields marked
- Validation on submit
- Clear error messages

### Lists
- Scrollable item lists
- Click to view details
- Formatted dates and amounts

### Charts
- Bar charts for monthly trends
- Progress bars for categories
- Visual profit/loss indicators

---

## 📱 Mobile Usage

The Farm Management module is fully responsive:
- ✅ Works on phones and tablets
- ✅ Touch-friendly buttons
- ✅ Scrollable lists
- ✅ Readable on small screens

---

## 🔒 Security Notes

- All APIs require authentication
- Data is user-specific (farmer-isolated)
- Passwords are hashed
- HTTPS recommended for production
- JWT tokens expire after set time

---

## 📈 Best Practices

1. **Regular Updates**: Add expenses and income regularly
2. **Accurate Data**: Enter correct amounts and dates
3. **Use Categories**: Categorize expenses properly
4. **Track Inventory**: Update stock levels after usage
5. **Download Reports**: Export monthly reports for records
6. **Check Dashboard**: Review analytics weekly
7. **Monitor Alerts**: Act on low stock warnings

---

## 🎓 Learning Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Implementation Details**: See `FARM_MANAGEMENT_IMPLEMENTATION.md`
- **Module README**: See `farm_management/README.md`

---

## ✅ Quick Checklist

Before using Farm Management:
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Logged in to application
- [ ] Farm Management tab visible
- [ ] Can see dashboard

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for errors
4. Verify both servers are running
5. Contact development team

---

**Happy Farming! 🌾**

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/farm-management/api/
- Admin Panel: http://127.0.0.1:8000/admin/
