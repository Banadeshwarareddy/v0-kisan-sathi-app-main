# 🎨 Marketplace Visual Guide

## 🔵 Buyer Mode

```
┌─────────────────────────────────────────────────────────────┐
│  🛒 Kisan Sathi Marketplace                    [🛍️ Buyer Mode] [📦 Farmer Mode] │
│  Buy fresh crops directly from farmers                      │
│  ═══════════════════════════════════════════════════════════│
└─────────────────────────────────────────────────────────────┘
                    ↓ BLUE GRADIENT HEADER ↓

┌─────────────────────────────────────────────────────────────┐
│  [🔍 Browse Products] [🛒 My Cart (2)] [📦 My Orders] [👤 My Profile]  │
│  ═══════════════════════════════════════════════════════════│
└─────────────────────────────────────────────────────────────┘
                    ↓ BLUE TAB BAR ↓

TABS AVAILABLE:
✅ Browse Products - Shop for crops
✅ My Cart - View cart items (with badge)
✅ My Orders - Track order history  
✅ My Profile - Account settings

FEATURES:
• Can add products to cart
• Blue "Add to Cart" buttons
• Cart badge shows item count
• Full shopping experience
```

---

## 🟢 Farmer Mode

```
┌─────────────────────────────────────────────────────────────┐
│  🌾 Farmer Dashboard                           [🛍️ Buyer Mode] [📦 Farmer Mode] │
│  Manage and sell your farm products                         │
│  ═══════════════════════════════════════════════════════════│
└─────────────────────────────────────────────────────────────┘
                    ↓ GREEN GRADIENT HEADER ↓

┌─────────────────────────────────────────────────────────────┐
│  [🔍 Browse Market] [📊 My Products] [👤 My Profile]        │
│  ═══════════════════════════════════════════════════════════│
└─────────────────────────────────────────────────────────────┘
                    ↓ GREEN TAB BAR ↓

TABS AVAILABLE:
✅ Browse Market - Research market prices
✅ My Products - Manage product listings
✅ My Profile - Account settings

FEATURES:
• NO Cart tab (farmers sell, don't buy)
• Info banner in Browse tab
• Green "View Details" buttons (disabled)
• Product management dashboard
```

---

## 🎯 Role Switcher Buttons

### Buyer Mode Active
```
┌──────────────────┐  ┌──────────────────┐
│ 🛍️ Buyer Mode    │  │ 📦 Farmer Mode   │
│ ════════════════ │  │                  │
│ WHITE BG         │  │ TRANSPARENT      │
│ BLUE TEXT        │  │ WHITE TEXT       │
│ SHADOW           │  │ HOVER EFFECT     │
└──────────────────┘  └──────────────────┘
     ACTIVE                INACTIVE
```

### Farmer Mode Active
```
┌──────────────────┐  ┌──────────────────┐
│ 🛍️ Buyer Mode    │  │ 📦 Farmer Mode   │
│                  │  │ ════════════════ │
│ TRANSPARENT      │  │ WHITE BG         │
│ WHITE TEXT       │  │ GREEN TEXT       │
│ HOVER EFFECT     │  │ SHADOW           │
└──────────────────┘  └──────────────────┘
     INACTIVE              ACTIVE
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
```
Buyer:  [Browse Products] [My Cart (2)] [My Orders] [My Profile]
Farmer: [Browse Market] [My Products] [My Profile]
```

### Tablet (640px - 1024px)
```
Buyer:  [Browse] [Cart (2)] [Orders] [Profile]
Farmer: [Market] [Products] [Profile]
```

### Mobile (< 640px)
```
Buyer:  [Browse] [Cart] 
        [Orders] [Profile]

Farmer: [Market] [Products]
        [Profile]
```

---

## 🎨 Color Palette

### Buyer Theme (Blue)
- **Primary:** #2563eb (Blue 600)
- **Hover:** #1d4ed8 (Blue 700)
- **Background:** #eff6ff (Blue 50)
- **Border:** #bfdbfe (Blue 200)

### Farmer Theme (Green)
- **Primary:** #16a34a (Green 600)
- **Hover:** #15803d (Green 700)
- **Background:** #f0fdf4 (Green 50)
- **Border:** #bbf7d0 (Green 200)

---

## 🔄 State Transitions

### Switching from Buyer to Farmer
```
1. Click "Farmer Mode" button
   ↓
2. Header gradient: Blue → Green (300ms)
   ↓
3. Tab bar background: Blue → Green (300ms)
   ↓
4. Tabs update: 4 tabs → 3 tabs
   ↓
5. Active tab resets to "Browse"
   ↓
6. Info banner appears in Browse tab
```

### Switching from Farmer to Buyer
```
1. Click "Buyer Mode" button
   ↓
2. Header gradient: Green → Blue (300ms)
   ↓
3. Tab bar background: Green → Blue (300ms)
   ↓
4. Tabs update: 3 tabs → 4 tabs
   ↓
5. Active tab resets to "Browse"
   ↓
6. Info banner disappears
```

---

## 📊 Tab Comparison

| Feature | Buyer Mode | Farmer Mode |
|---------|-----------|-------------|
| Browse Products | ✅ Yes | ✅ Yes (with info banner) |
| My Cart | ✅ Yes | ❌ No |
| My Orders | ✅ Yes | ❌ No |
| My Products | ❌ No | ✅ Yes |
| My Profile | ✅ Yes | ✅ Yes |
| **Total Tabs** | **4** | **3** |

---

## 🎯 User Actions

### Buyer Can:
- ✅ Browse all products
- ✅ Add products to cart
- ✅ Update cart quantities
- ✅ Remove cart items
- ✅ View order history
- ✅ Track orders
- ✅ Manage profile

### Farmer Can:
- ✅ Browse market for research
- ✅ Add new products
- ✅ Edit product listings
- ✅ Delete products
- ✅ View sales statistics
- ✅ Manage profile
- ❌ Cannot add to cart (not a buyer)

---

## 💡 Info Banner (Farmer Only)

```
┌─────────────────────────────────────────────────────────────┐
│  📦  Farmer View - Market Research                          │
│                                                              │
│  You're viewing the marketplace to see what other farmers   │
│  are selling and current market prices. To manage your own  │
│  products, go to the "My Products" tab.                     │
└─────────────────────────────────────────────────────────────┘
     ↑ GREEN BACKGROUND WITH GREEN BORDER ↑
```

---

## 🎨 Product Card Buttons

### Buyer View
```
┌──────────────────┐
│  Product Image   │
│  Product Name    │
│  ₹40/kg          │
│                  │
│ [🛒 Add to Cart] │ ← BLUE BUTTON, CLICKABLE
└──────────────────┘
```

### Farmer View
```
┌──────────────────┐
│  Product Image   │
│  Product Name    │
│  ₹40/kg          │
│                  │
│ [📦 View Details]│ ← GREEN OUTLINE, DISABLED
└──────────────────┘
```

---

## ✨ Animation Effects

### Header Transition
- Duration: 300ms
- Easing: ease-in-out
- Property: background-color

### Tab Transition
- Duration: 200ms
- Easing: ease-in-out
- Property: background-color, color

### Button Hover
- Duration: 150ms
- Easing: ease-in-out
- Property: background-color, transform

### Badge Pulse
- Animation: subtle pulse
- Duration: 2s
- Iteration: infinite

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
│  (Dynamic color based on role)                              │
├─────────────────────────────────────────────────────────────┤
│                      CONTAINER                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    TAB BAR                            │  │
│  │  (Role-specific tabs)                                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │                  TAB CONTENT                          │  │
│  │  (Browse / Cart / Orders / Products / Profile)       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Visual Differences

| Element | Buyer Mode | Farmer Mode |
|---------|-----------|-------------|
| Header Color | Blue Gradient | Green Gradient |
| Header Title | 🛒 Marketplace | 🌾 Dashboard |
| Tab Bar Color | Blue 50 | Green 50 |
| Active Tab | Blue 600 | Green 600 |
| Button Color | Blue 600 | Green 600 |
| Info Banner | None | Green 50 |
| Tab Count | 4 tabs | 3 tabs |

---

**This visual guide helps you understand the complete UI/UX redesign!**
