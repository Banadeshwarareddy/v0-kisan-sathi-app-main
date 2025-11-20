# User Roles & Authentication Explained 🎯

## Understanding the System

Your Kisan Sathi app has **ONE main user type** with **TWO marketplace roles**:

### Main User: Farmer
- **Model**: `Farmer` (in farmers app)
- **Purpose**: Main user account for the entire platform
- **Can access**: Farm Management, Weather, Chatbot, Admin, etc.
- **Login**: Phone number + Password

### Marketplace Roles (Optional Profiles)

When a Farmer wants to use the marketplace, they can have:

1. **FarmerProfile** (Seller Role)
   - Allows selling products
   - Can add products to marketplace
   - Has farm details, verification status
   - Think of it as: "Farmer as a Seller"

2. **BuyerProfile** (Buyer Role)
   - Allows buying products
   - Can add to cart, place orders
   - Has delivery addresses
   - Think of it as: "Farmer as a Buyer"

## How It Works

```
┌─────────────────────────────────────────┐
│         Farmer (Main Account)           │
│  Phone: +916366673457                   │
│  Can access: All platform features      │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│FarmerProfile │        │BuyerProfile  │
│(Seller)      │        │(Buyer)       │
│              │        │              │
│Can: Add      │        │Can: Buy      │
│products,     │        │products,     │
│manage        │        │place orders, │
│listings      │        │cart          │
└──────────────┘        └──────────────┘
```

## Your Current Situation

**Your Account:**
- ✅ Farmer account exists: `+916366673457`
- ❌ FarmerProfile (seller) doesn't exist yet
- ❌ BuyerProfile doesn't exist yet

**That's why you see**: "Only farmers can add products"
- The system checks if you have a FarmerProfile
- You don't have one yet, so it blocks product creation

## Solution: Create FarmerProfile

I'll create a FarmerProfile for your account so you can sell products:

```python
from farmers.models import Farmer
from marketplace.models import FarmerProfile

farmer = Farmer.objects.get(phone='+916366673457')
FarmerProfile.objects.create(
    user=farmer,
    farm_name="My Farm",
    verification_status='verified',
    farm_size_acres=10.0,
    address="Kodla Village",
    district="Gulbarga",
    state="Karnataka"
)
```

## Complete User Journey

### Scenario 1: Farmer Wants to Sell
1. **Signup/Login** as Farmer
2. **Create FarmerProfile** (becomes a seller)
3. **Add products** in marketplace
4. **Manage orders** from buyers

### Scenario 2: Farmer Wants to Buy
1. **Signup/Login** as Farmer
2. **Create BuyerProfile** (becomes a buyer)
3. **Browse products** in marketplace
4. **Add to cart** and checkout

### Scenario 3: Farmer Wants Both
1. **Signup/Login** as Farmer
2. **Create FarmerProfile** (can sell)
3. **Create BuyerProfile** (can buy)
4. **Do both!** Sell your products AND buy from others

## Real-World Example

**Ramesh** is a farmer:
- He grows tomatoes → Creates **FarmerProfile** → Sells tomatoes
- He needs seeds → Uses **BuyerProfile** → Buys seeds from others
- Same account, two roles!

## Current Implementation

### Login Process
1. User enters phone + password
2. System checks `Farmer` model
3. If valid, user is logged in
4. Token stored as `kisan-sathi-access`

### Marketplace Access
1. User goes to marketplace
2. Wants to add product?
   - System checks: Does user have `FarmerProfile`?
   - If YES → Allow product creation
   - If NO → Show error "Only farmers can add products"

3. Wants to buy product?
   - System checks: Does user have `BuyerProfile`?
   - If YES → Allow cart/checkout
   - If NO → Create BuyerProfile automatically (or show prompt)

## Fix for Your Account

Run this command to create your FarmerProfile:

```bash
python manage.py shell
```

Then paste:
```python
from farmers.models import Farmer
from marketplace.models import FarmerProfile

farmer = Farmer.objects.get(phone='+916366673457')

# Check if profile exists
if hasattr(farmer, 'farmer_profile'):
    print("✅ FarmerProfile already exists!")
else:
    # Create FarmerProfile
    profile = FarmerProfile.objects.create(
        user=farmer,
        farm_name="Banadeshwara Farm",
        verification_status='verified',
        farm_size_acres=10.0,
        address="Kodla Village",
        district="Gulbarga",
        state="Karnataka",
        pincode="585102"
    )
    print("✅ FarmerProfile created! You can now add products!")
```

## After Creating FarmerProfile

1. **Refresh** the marketplace page
2. **Click** "Add Product"
3. **Fill** the form
4. **Upload** images
5. **Submit** - It will work! ✅

## Summary

- **Farmer** = Main account (login, access all features)
- **FarmerProfile** = Seller role (can add/sell products)
- **BuyerProfile** = Buyer role (can buy products)
- **One Farmer** can have both profiles (sell AND buy)

Your issue: You have a Farmer account but no FarmerProfile yet. Once we create it, you can add products!

---

**Next Step**: Let me create the FarmerProfile for you right now!
