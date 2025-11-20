# 🔧 Profile Loading - Debug Guide

## ✅ What I Fixed

1. **Added TypeScript types** - No more type errors
2. **Added console logging** - See what's happening
3. **Better error handling** - Know if something fails
4. **Profile API call** - Fetches YOUR real data

---

## 🧪 How to Test & Debug

### Step 1: Clear Browser Cache
```
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page
```

### Step 2: Login Fresh
```
1. Go to: http://localhost:3000/login
2. Enter: +916366673457
3. Enter: Bannu@123
4. Click Login
```

### Step 3: Check Console Logs
```
1. Open DevTools (F12)
2. Go to Console tab
3. Go to: http://localhost:3000/marketplace/farmer-dashboard
4. Click "My Profile" tab
5. Look for these messages:
```

**Expected Console Output:**
```
Loading profile with token: Token exists
Profile response status: 200
Profile data received: {success: true, data: {...}}
Profile set successfully: {id: X, first_name: "BANADESHWARAREDDY", ...}
```

---

## 🔍 Troubleshooting

### Issue 1: Shows "John Doe" or Mock Data

**Cause**: Profile not loading from API

**Check Console For:**
```
❌ "No authentication token found"
   → Solution: Login again

❌ "Profile response status: 401"
   → Solution: Token expired, login again

❌ "Profile response status: 404"
   → Solution: Profile endpoint issue
```

**Fix:**
1. Logout completely
2. Clear localStorage
3. Login again
4. Try accessing profile

### Issue 2: Profile Shows "Unable to load profile"

**Cause**: API call failed or returned null

**Check Console For:**
```
❌ "Error loading profile: ..."
   → Check if backend is running
   → Check if token is valid
```

**Fix:**
```bash
# Make sure backend is running
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

### Issue 3: Token Not Found

**Cause**: Not logged in or token cleared

**Fix:**
1. Go to http://localhost:3000/login
2. Login with your credentials
3. Token will be saved automatically
4. Try again

---

## 🧪 Manual API Test

### Test Profile API Directly

**Step 1: Get Your Token**
```javascript
// In browser console (F12)
localStorage.getItem('kisan-sathi-access')
```

**Step 2: Test API Call**
```javascript
// In browser console
const token = localStorage.getItem('kisan-sathi-access');
fetch('http://127.0.0.1:8000/api/farmers/profile/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Profile:', data))
.catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phone": "+916366673457",
    "email": "banadeshwarareddyreddy@gmail.com",
    "first_name": "BANADESHWARAREDDY",
    "last_name": "",
    "district": "Gulbarga",
    "taluk": "...",
    "village": "Kodla",
    "land_size": "10.00",
    "crops_grown": [...],
    "preferred_language": "kn",
    "profile_picture": null,
    "is_verified": true,
    "created_at": "2025-..."
  }
}
```

---

## 📋 Checklist

Before reporting an issue, verify:

- [ ] Backend server is running (http://localhost:8000)
- [ ] Frontend server is running (http://localhost:3000)
- [ ] You are logged in
- [ ] Token exists in localStorage
- [ ] Console shows no errors
- [ ] Profile API returns 200 status

---

## 🎯 Quick Fix Commands

### Clear Everything and Start Fresh
```javascript
// In browser console (F12)
localStorage.clear();
location.reload();
```

Then login again.

### Check What's in localStorage
```javascript
// In browser console
console.log('Token:', localStorage.getItem('kisan-sathi-access'));
console.log('User:', localStorage.getItem('kisan-sathi-user'));
```

---

## 💡 What Should Happen

### Correct Flow:
1. **Login** → Token saved to localStorage
2. **Navigate to Farmer Dashboard** → Page loads
3. **Click "My Profile" tab** → API call made
4. **Console logs** → Shows profile data
5. **Profile displays** → YOUR real data (BANADESHWARAREDDY)

### Your Real Data Should Show:
- ✅ Name: BANADESHWARAREDDY
- ✅ Phone: +916366673457
- ✅ Email: banadeshwarareddyreddy@gmail.com
- ✅ Village: Kodla
- ✅ District: Gulbarga
- ✅ Land Size: 10 acres
- ✅ Verified: Yes ✓

---

## 🚀 Try It Now

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Login**: http://localhost:3000/login
4. **Go to Dashboard**: http://localhost:3000/marketplace/farmer-dashboard
5. **Click "My Profile" tab**
6. **Watch console logs**
7. **See your real data!**

If you still see "John Doe", share the console logs with me! 🔍
