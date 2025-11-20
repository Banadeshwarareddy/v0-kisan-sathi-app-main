# How to Add Marketplace Data

You have **3 ways** to add data to your marketplace:

## 🔐 Your Admin Credentials
- **Phone**: +916366673457
- **Email**: banadeshwarareddyreddy@gmail.com
- **Password**: Bannu@123

---

## Method 1: Django Admin Panel (Recommended for Bulk Operations)

### Access
- URL: **http://localhost:8000/admin/**
- Login with your admin credentials above

### What You Can Do
✅ Add/Edit/Delete all marketplace data
✅ Manage farmers, buyers, products, orders
✅ Approve/reject farmer verifications
✅ Manage reviews, coupons, notifications
✅ View metrics and analytics
✅ Bulk operations (approve multiple items, etc.)

### Available Models
- **Farmer Profiles** - Manage farmer accounts and verification
- **Buyer Profiles** - Manage buyer accounts
- **Crop Categories** - Create product categories
- **Crop Products** - Add products with full details
- **Orders** - View and manage all orders
- **Product Reviews** - Moderate reviews
- **Coupons** - Create discount coupons
- **Notifications** - Send notifications to users
- **Daily Metrics** - View business analytics

### Steps to Add a Product via Admin
1. Go to http://localhost:8000/admin/
2. Login with your credentials
3. Click "Crop products" → "Add crop product"
4. Fill in all details:
   - Select farmer (or create one first)
   - Choose category
   - Enter product name, price, quantity
   - Add description and specifications
   - Upload images
   - Set quality grade and certifications
5. Click "Save"

---

## Method 2: Website Form (Django Templates)

### Access
- **Add Product**: http://localhost:8000/marketplace/add-product/
- **Farmer Dashboard**: http://localhost:8000/marketplace/farmer-dashboard/

### Features
✅ User-friendly form interface
✅ Image upload with live preview
✅ Multiple image support
✅ Real-time validation
✅ Mobile responsive

### Steps to Add a Product
1. Login at http://localhost:8000/marketplace/
2. Go to Farmer Dashboard or Add Product page
3. Fill the form:
   - Product name and category
   - Price and quantity
   - Description
   - Upload images (drag & drop or click)
   - Quality details
4. Click "Add Product"

---

## Method 3: Next.js Frontend (Modern UI)

### Access
- **Marketplace**: http://localhost:3000/marketplace
- **Farmer Dashboard**: http://localhost:3000/marketplace/farmer-dashboard

### Features
✅ Modern React interface
✅ Real-time API integration
✅ Image upload with preview
✅ Better UX/UI
✅ Faster performance

### Steps to Add a Product
1. Go to http://localhost:3000/marketplace
2. Login with your credentials
3. Navigate to Farmer Dashboard
4. Click "Add New Product"
5. Fill the form and upload images
6. Submit

---

## Quick Start: Add Your First Product

### Option A: Via Django Admin (Fastest)
```bash
1. Open: http://localhost:8000/admin/
2. Login: +916366673457 / Bannu@123
3. Click: Marketplace → Crop products → Add crop product
4. Fill form and save
```

### Option B: Via Website Form
```bash
1. Open: http://localhost:8000/marketplace/add-product/
2. Login if needed
3. Fill form with product details
4. Upload images
5. Click "Add Product"
```

### Option C: Via Next.js
```bash
1. Open: http://localhost:3000/marketplace
2. Login with your credentials
3. Go to Farmer Dashboard
4. Add product through the form
```

---

## Sample Product Data

Here's example data you can use:

**Product 1: Organic Tomatoes**
- Category: Vegetables
- Price: ₹40 per kg
- Quantity: 500 kg
- Quality: Grade A
- Organic: Yes
- Description: Fresh organic tomatoes from Karnataka

**Product 2: Basmati Rice**
- Category: Grains
- Price: ₹80 per kg
- Quantity: 1000 kg
- Quality: Premium
- Description: Premium quality basmati rice

**Product 3: Fresh Milk**
- Category: Dairy
- Price: ₹50 per liter
- Quantity: 200 liters
- Quality: Grade A
- Description: Fresh cow milk, daily supply

---

## Tips

1. **Use Django Admin** for:
   - Bulk operations
   - Quick data entry
   - Managing multiple items
   - Administrative tasks

2. **Use Website Forms** for:
   - Regular product additions
   - Farmer self-service
   - Image-heavy products

3. **Use Next.js** for:
   - Best user experience
   - Modern interface
   - Mobile users

---

## Need Help?

- Django Admin docs: http://localhost:8000/admin/doc/
- API endpoints: http://localhost:8000/api/marketplace/
- Frontend: http://localhost:3000/marketplace

All three methods save to the same database, so data is synchronized across all interfaces!
