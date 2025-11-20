# How to Access Product Image Upload Feature

## The Issue

You're seeing a simple "Add Product" modal without image upload fields. This is likely from:
- The Next.js frontend at `http://localhost:3000`
- Or a different Django page

## The Solution

The **NEW image upload feature** I just implemented is at a **different URL**:

### ✅ Correct URL for Image Upload:

```
http://localhost:8000/marketplace/farmer/add-product/
```

## Step-by-Step Access:

### Option 1: Direct URL
1. Open your browser
2. Go to: `http://localhost:8000/marketplace/farmer/add-product/`
3. You'll see the full form with image upload fields

### Option 2: From Farmer Dashboard
1. Go to: `http://localhost:8000/marketplace/farmer/dashboard/`
2. Click the **"+ Add Product"** button
3. You'll be redirected to the image upload form

## What You Should See:

The correct page has these sections:
- ✅ **Basic Information** (name, category, variety, description)
- ✅ **Pricing & Inventory** (price, quantity, unit)
- ✅ **Quality & Certifications** (grade, organic, FSSAI, dates)
- ✅ **Product Images** section with:
  - **Primary Image** upload (required)
  - **Additional Images** upload (up to 5, optional)
  - Live image preview
- ✅ **Listing Status** (draft/active/inactive)

## Screenshot Comparison:

### ❌ What You're Seeing (Wrong Page):
- Simple modal popup
- Only basic fields
- NO image upload
- Checkbox for "organic certified"

### ✅ What You Should See (Correct Page):
- Full page form (not a modal)
- Complete product details
- **Primary Image upload field**
- **Additional Images upload field**
- Image preview areas
- Back button to dashboard

## Quick Test:

Open this URL directly in your browser:
```
http://localhost:8000/marketplace/farmer/add-product/
```

If you see a full-page form with image upload fields, you're in the right place!

## Alternative: Check Django Admin

If you want to add products through Django admin (also has image upload):

1. Go to: `http://localhost:8000/admin/`
2. Login with admin credentials
3. Go to **Marketplace** → **Crop Products**
4. Click **Add Crop Product**
5. You'll see the admin form with image fields

## Need Help?

If you still can't see the image upload fields:
1. Make sure Django server is running on port 8000
2. Clear your browser cache
3. Try in incognito/private mode
4. Check the URL is exactly: `http://localhost:8000/marketplace/farmer/add-product/`

## Current Servers:

- **Django Backend**: http://localhost:8000 (for marketplace templates)
- **Next.js Frontend**: http://localhost:3000 (different interface)

The image upload feature is on the **Django backend** (port 8000), not the Next.js frontend (port 3000).
