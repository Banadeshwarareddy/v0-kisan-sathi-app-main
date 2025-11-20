# Complete User Guide - Kisan Sathi 📚

## ✅ YOUR ACCOUNT IS NOW READY!

Your FarmerProfile has been created! You can now add products to the marketplace.

---

## Understanding Users & Roles

### 1. Main Account: Farmer
**What it is**: Your main login account
**Created when**: You sign up
**Used for**: Login, accessing all platform features

**Your Account:**
```
Phone: +916366673457
Email: banadeshwarareddyreddy@gmail.com
Password: Bannu@123
Name: BANADESHWARAREDDY
```

### 2. Marketplace Roles (Profiles)

#### FarmerProfile (Seller) ✅ NOW CREATED!
**What it is**: Your seller profile in marketplace
**Allows you to**:
- Add products for sale
- Manage your product listings
- View orders from buyers
- Track sales

**Your FarmerProfile:**
```
Farm Name: Banadeshwara Farm
Location: Kodla Village, Gulbarga, Karnataka
Status: Verified ✅
Farm Size: 10 acres
```

#### BuyerProfile (Buyer)
**What it is**: Your buyer profile in marketplace
**Allows you to**:
- Browse and search products
- Add products to cart
- Place orders
- Track deliveries

**Note**: BuyerProfile is created automatically when you first add something to cart

---

## How Login Works

### Step-by-Step Login Process

1. **You enter credentials**
   ```
   Phone: +916366673457
   Password: Bannu@123
   ```

2. **System checks Farmer model**
   - Verifies phone number exists
   - Checks password is correct

3. **If valid, system creates JWT token**
   - Token stored as `kisan-sathi-access` in browser
   - Token expires after some time (you'll need to login again)

4. **You're logged in!**
   - Can access all features
   - Token sent with every API request

### What Happens Behind the Scenes

```
Login Request
     ↓
Django Backend checks Farmer model
     ↓
Password correct? → YES
     ↓
Generate JWT Token
     ↓
Send token to browser
     ↓
Browser stores token in localStorage
     ↓
Every API request includes this token
     ↓
Backend verifies token
     ↓
Request allowed!
```

---

## Marketplace: Seller vs Buyer

### As a SELLER (FarmerProfile)

**What you can do:**
1. Add products
2. Set prices
3. Upload product images
4. Manage inventory
5. View orders
6. Update product details

**How to add a product:**
1. Go to http://localhost:3000/marketplace
2. Click "Farmer Dashboard"
3. Click "Add New Product"
4. Fill in:
   - Product name (e.g., "Fresh Tomatoes")
   - Category (select from dropdown)
   - Price per unit (e.g., 50)
   - Quantity available (e.g., 100)
   - Unit (kg, liter, etc.)
   - Description
   - Quality grade
5. Upload images
6. Click "Add Product"
7. Done! ✅

### As a BUYER (BuyerProfile)

**What you can do:**
1. Browse all products
2. Search and filter
3. Add to cart
4. Place orders
5. Track deliveries
6. Leave reviews

**How to buy a product:**
1. Go to http://localhost:3000/marketplace
2. Browse products
3. Click on a product
4. Click "Add to Cart"
5. Go to cart
6. Click "Checkout"
7. Enter delivery address
8. Place order
9. Done! ✅

---

## Complete Feature Access

### What You Can Access Now

| Feature | URL | Requires |
|---------|-----|----------|
| **Homepage** | http://localhost:3000/ | Nothing |
| **Login** | http://localhost:3000/login | Nothing |
| **Dashboard** | http://localhost:3000/dashboard | Login |
| **Farm Management** | http://localhost:3000/farm-management | Login |
| **Marketplace (Browse)** | http://localhost:3000/marketplace | Login |
| **Add Products** | Marketplace → Farmer Dashboard | Login + FarmerProfile ✅ |
| **Buy Products** | Marketplace → Add to Cart | Login + BuyerProfile (auto-created) |
| **Chatbot** | http://localhost:3000/chatbot | Login |
| **Weather** | http://localhost:3000/weather | Login |
| **Admin Panel** | http://localhost:8000/admin/ | Admin credentials |

---

## Common Scenarios

### Scenario 1: I want to sell my crops
1. ✅ Login (you have account)
2. ✅ FarmerProfile exists (just created!)
3. ✅ Go to marketplace
4. ✅ Add products
5. ✅ Start selling!

### Scenario 2: I want to buy seeds
1. ✅ Login (you have account)
2. ✅ Go to marketplace
3. ✅ Browse products
4. ✅ Add to cart
5. ✅ BuyerProfile created automatically
6. ✅ Checkout and buy!

### Scenario 3: I want to do both
1. ✅ Login (you have account)
2. ✅ Sell: Use FarmerProfile (exists!)
3. ✅ Buy: Use BuyerProfile (auto-created when needed)
4. ✅ Do both!

---

## Why Two Profiles?

**Separation of Concerns:**
- **FarmerProfile**: Business/seller data (farm details, verification, sales)
- **BuyerProfile**: Customer data (delivery addresses, orders, reviews)

**Benefits:**
- Clean data organization
- Different permissions for selling vs buying
- Can track seller performance separately from buyer behavior
- Verification only needed for sellers, not buyers

**Real Example:**
```
Ramesh (Farmer account)
├── FarmerProfile (Seller)
│   ├── Farm: "Ramesh Organic Farm"
│   ├── Products: Tomatoes, Onions
│   └── Sales: ₹50,000 this month
│
└── BuyerProfile (Buyer)
    ├── Orders: Seeds, Fertilizer
    ├── Delivery: Ramesh's Farm Address
    └── Spent: ₹5,000 this month
```

---

## Testing Your Setup

### Test 1: Can you login?
```
1. Go to http://localhost:3000/login
2. Enter: +916366673457 / Bannu@123
3. Should redirect to dashboard ✅
```

### Test 2: Can you add products?
```
1. Go to http://localhost:3000/marketplace
2. Click "Farmer Dashboard"
3. Click "Add New Product"
4. Fill form and submit
5. Should work now! ✅
```

### Test 3: Can you browse products?
```
1. Go to http://localhost:3000/marketplace
2. Should see existing products ✅
3. Can search and filter ✅
```

---

## Troubleshooting

### "Only farmers can add products"
**Solution**: ✅ FIXED! FarmerProfile created

### "Authentication credentials were not provided"
**Solution**: Login first at http://localhost:3000/login

### "403 Forbidden"
**Solution**: Make sure you're logged in and have FarmerProfile (you do now!)

### Can't see my added products
**Solution**: Refresh the page or check "My Products" in Farmer Dashboard

---

## Quick Reference

### Your Credentials
```
Phone: +916366673457
Password: Bannu@123
```

### Your Profiles
```
✅ Farmer Account: Active
✅ FarmerProfile: Created & Verified
⏳ BuyerProfile: Will be created when you first buy something
```

### Key URLs
```
Login: http://localhost:3000/login
Marketplace: http://localhost:3000/marketplace
Add Product: Marketplace → Farmer Dashboard → Add Product
```

---

## Summary

1. **One Account** (Farmer) - for login and platform access
2. **Two Roles** (FarmerProfile + BuyerProfile) - for marketplace
3. **FarmerProfile** = Seller (can add products) ✅ YOU HAVE THIS
4. **BuyerProfile** = Buyer (can buy products) - auto-created when needed

**You're all set! Go add some products!** 🎉
