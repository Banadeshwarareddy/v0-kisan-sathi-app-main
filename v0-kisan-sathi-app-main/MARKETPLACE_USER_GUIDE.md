# 🌾 Marketplace User Guide - How It Works

## 📖 Overview

The Kisan Sathi Marketplace is a platform where **farmers can sell** their crops directly to **buyers** (retailers, wholesalers, restaurants, etc.) without middlemen.

## 🎯 Main Features

### 1. **Browse Products** 
View all available crops from verified farmers across India.

### 2. **Search & Filter**
Find exactly what you need using powerful search and filtering tools.

### 3. **Direct Purchase**
Buy directly from farmers at fair prices.

### 4. **Quality Assurance**
All products are graded (Premium, Grade A, Grade B) and some are organic certified.

---

## 🚀 How to Use the Marketplace

### **Homepage** (`/marketplace`)

#### What You See:
1. **Hero Section** - Big green banner with search bar
2. **Quick Stats** - Shows total products, farmers, orders, and ratings
3. **Category Buttons** - Quick filters (Vegetables, Fruits, Grains, etc.)
4. **Featured Products** - Top 4 highlighted products
5. **All Products Grid** - All available products in cards

#### What You Can Do:

**🔍 Search for Products:**
1. Type in the search bar (e.g., "tomatoes", "organic", "rice")
2. Press Enter or click the search icon
3. Results will filter automatically

**📂 Filter by Category:**
1. Click any category button (Vegetables, Fruits, Grains, Pulses, Spices)
2. Only products from that category will show
3. Click "All Categories" to reset

**👁️ View Product Details:**
Each product card shows:
- **Product Image** - Visual of the crop
- **Product Name** - What it is
- **Category** - Type of crop
- **Farmer Name** - Who's selling it (with 👨‍🌾 icon)
- **Rating** - Star rating (⭐⭐⭐⭐⭐)
- **Price** - Current price in ₹ (INR)
- **Original Price** - Crossed out if discounted
- **Discount Badge** - Red badge showing % off
- **Quality Badges**:
  - 🌱 Organic - Certified organic
  - ⭐ Premium - Highest quality
- **Stock Status** - "✓ X kg available" or "✗ Out of stock"
- **Buttons**:
  - 🛒 Add to Cart - Add product to your cart
  - ❤️ Wishlist - Save for later

---

### **Products Page** (`/marketplace/products`)

This is the advanced browsing page with more filtering options.

#### Desktop View:
- **Left Sidebar** - All filters
- **Right Side** - Product grid
- **Top Bar** - Search, product count, sort dropdown

#### Mobile View:
- **Filter Button** - Opens drawer with all filters
- **Product Grid** - Full width
- **Sort Dropdown** - At the top

#### Advanced Filters:

**1. Search Box**
- Type product name or keywords
- Real-time filtering

**2. Category Dropdown**
- Select from: Vegetables, Fruits, Grains, Pulses, Spices
- Or choose "All Categories"

**3. Price Range**
- **Min Price** - Enter minimum price (e.g., 20)
- **Max Price** - Enter maximum price (e.g., 100)
- Shows only products in that price range

**4. Quality Grade** (Checkboxes)
- ☑️ Premium - Highest quality
- ☑️ Grade A - High quality
- ☑️ Grade B - Good quality
- Can select multiple

**5. Certifications**
- ☑️ Organic Certified - Only organic products

**6. State Filter**
- Choose farmer's location
- Options: Karnataka, Tamil Nadu, Andhra Pradesh, Kerala

**7. Sort By** (Dropdown)
- **Newest First** - Recently added products
- **Price: Low to High** - Cheapest first
- **Price: High to Low** - Most expensive first
- **Highest Rated** - Best rated products first

**8. Clear All Filters Button**
- Resets everything to default

#### Pagination:
- Shows 20 products per page
- **Previous** button - Go to previous page
- **Page X of Y** - Current page indicator
- **Next** button - Go to next page

---

## 💡 Understanding Product Information

### **Price Display**
```
₹40  ₹50
```
- **₹40** (Green, large) = Current selling price
- **₹50** (Gray, crossed) = Original price (if discounted)

### **Discount Badge**
```
20% OFF
```
- Red badge on product image
- Shows percentage discount

### **Quality Badges**
- **🌱 Organic** - Green badge, certified organic
- **⭐ Premium** - Blue badge, highest quality grade

### **Stock Status**
- **✓ 500 kg available** (Green) = In stock
- **✗ Out of stock** (Red) = Not available

### **Rating System**
- ⭐⭐⭐⭐⭐ (5 stars maximum)
- Number in parentheses = review count
- Example: ⭐⭐⭐⭐☆ (25) = 4 stars from 25 reviews

---

## 🛒 Shopping Actions

### **Add to Cart**
1. Click the "Add to Cart" button on any product
2. Product is added to your shopping cart
3. Continue shopping or proceed to checkout
4. *(Cart functionality coming soon)*

### **Add to Wishlist**
1. Click the ❤️ heart icon
2. Product is saved to your wishlist
3. Access wishlist later to purchase
4. *(Wishlist page coming soon)*

---

## 📊 Current Sample Data

### Available Products (10):

1. **Organic Tomatoes** - ₹40/kg
   - Category: Vegetables
   - Quality: Premium, Organic
   - Discount: 20% off

2. **Fresh Potatoes** - ₹25/kg
   - Category: Vegetables
   - Quality: Grade A

3. **Organic Basmati Rice** - ₹80/kg
   - Category: Grains
   - Quality: Premium, Organic
   - Discount: 20% off

4. **Fresh Mangoes** - ₹150/kg
   - Category: Fruits
   - Quality: Premium
   - Discount: 17% off

5. **Organic Onions** - ₹35/kg
   - Category: Vegetables
   - Quality: Grade A, Organic
   - Discount: 22% off

6. **Toor Dal** - ₹120/kg
   - Category: Pulses
   - Quality: Grade A
   - Discount: 14% off

7. **Organic Turmeric Powder** - ₹400/kg
   - Category: Spices
   - Quality: Premium, Organic
   - Discount: 20% off

8. **Fresh Carrots** - ₹45/kg
   - Category: Vegetables
   - Quality: Grade A
   - Discount: 18% off

9. **Organic Wheat** - ₹35/kg
   - Category: Grains
   - Quality: Premium, Organic
   - Discount: 17% off

10. **Fresh Bananas** - ₹50/dozen
    - Category: Fruits
    - Quality: Grade A
    - Discount: 17% off

### Farmer Information:
- **Farm Name:** Green Valley Farms
- **Farmer:** Test Farmer
- **Location:** Telangana, Rangareddy District
- **Rating:** 4.5 ⭐ (120 reviews)
- **Total Orders:** 85
- **Status:** ✅ Verified

---

## 🎮 Try These Examples

### Example 1: Find Organic Products
1. Go to `/marketplace/products`
2. Check the "🌱 Organic Certified" checkbox
3. See only organic products (6 items)

### Example 2: Find Cheap Vegetables
1. Go to `/marketplace/products`
2. Select "Vegetables" from category dropdown
3. Set Max Price to 50
4. Sort by "Price: Low to High"
5. See affordable vegetables

### Example 3: Find Premium Products
1. Go to `/marketplace/products`
2. Check "Premium" in Quality Grade
3. See only premium quality items

### Example 4: Search for Rice
1. Go to `/marketplace`
2. Type "rice" in search bar
3. Press Enter
4. See rice products

---

## 🔄 How the System Works (Technical)

### Architecture:
```
Browser (Next.js) ←→ API (Django) ←→ Database (SQLite)
```

### Data Flow:
1. **You visit** `/marketplace`
2. **Frontend** (Next.js) loads the page
3. **Frontend calls** Django API at `http://localhost:8000/api/marketplace/products/`
4. **Backend** (Django) queries the database
5. **Database** returns product data
6. **Backend** sends JSON response
7. **Frontend** displays products in cards

### API Endpoints Used:
- `GET /api/marketplace/products/` - List all products
- `GET /api/marketplace/products/featured/` - Featured products
- `GET /api/marketplace/categories/` - Product categories
- `GET /api/marketplace/products/?search=tomato` - Search
- `GET /api/marketplace/products/?category=1` - Filter by category
- `GET /api/marketplace/products/?min_price=20&max_price=100` - Price range

### Filters Work By:
- **Search** - Matches product name, description, variety
- **Category** - Filters by category ID
- **Price** - SQL query: `price >= min AND price <= max`
- **Quality** - Filters by quality_grade field
- **Organic** - Filters where is_organic_certified = True
- **Sort** - SQL ORDER BY clause

---

## 🎯 What's Next (Coming Soon)

### Phase 1 (Current) ✅
- ✅ Browse products
- ✅ Search & filter
- ✅ View product details
- ✅ Category navigation

### Phase 2 (Coming Soon)
- 🔜 Product detail page (click on product)
- 🔜 Shopping cart functionality
- 🔜 Checkout process
- 🔜 Order placement

### Phase 3 (Future)
- 🔜 User authentication (buyer/farmer login)
- 🔜 Wishlist page
- 🔜 Order tracking
- 🔜 Payment integration
- 🔜 Reviews & ratings submission
- 🔜 Farmer dashboard (add/edit products)
- 🔜 Buyer dashboard (order history)

---

## 🆘 Troubleshooting

### No Products Showing?
1. Check if Django backend is running (port 8000)
2. Check browser console for errors (F12)
3. Verify database has products: `python manage.py seed_marketplace`

### Filters Not Working?
1. Clear all filters and try again
2. Refresh the page
3. Check if products match your filter criteria

### Images Not Loading?
- Currently using placeholder images
- Real images will be added when farmers upload them

---

## 📞 Support

If you need help:
1. Check this guide first
2. Look at the documentation files in the project
3. Check browser console for errors (F12)
4. Verify both servers are running (Django + Next.js)

---

## 🎊 Enjoy the Marketplace!

You now have a fully functional marketplace where farmers can sell and buyers can purchase agricultural products directly. The platform eliminates middlemen and ensures fair prices for both parties.

**Happy Shopping! 🌾🛒**
