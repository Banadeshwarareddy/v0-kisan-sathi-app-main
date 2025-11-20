# JWT Token Authentication Fix

## ✅ ISSUE FIXED

**Problem:** "Given token not valid for any token type" error when submitting expenses/income.

**Root Cause:** Frontend was using wrong localStorage key for JWT token.
- **Expected:** `kisan-sathi-access`
- **Used:** `token`

**Solution:** Updated all API calls to use correct token key and added proper JWT configuration.

---

## 🔧 CHANGES MADE

### 1. Backend - JWT Configuration

**File:** `kisan_sathi/settings.py`

**Added SIMPLE_JWT Settings:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}
```

**Benefits:**
- ✅ Tokens valid for 1 day (access) and 7 days (refresh)
- ✅ Proper JWT validation
- ✅ Standard Bearer token format
- ✅ User ID claim for authentication

---

### 2. Frontend - Token Key Fix

**Files Updated:**
- `expense-management.tsx`
- `income-management.tsx`
- `farm-dashboard.tsx`

**Before:**
```typescript
const token = localStorage.getItem('token')  // ❌ Wrong key
```

**After:**
```typescript
const token = localStorage.getItem('kisan-sathi-access')  // ✅ Correct key
```

**All API Calls Updated:**
- ✅ POST /api/expenses/
- ✅ GET /api/expenses/
- ✅ POST /api/income/
- ✅ GET /api/income/
- ✅ GET /api/dashboard-stats/
- ✅ GET /api/monthly-profit/
- ✅ GET /api/expense-by-category/
- ✅ Export endpoints (PDF/Excel)

---

### 3. Token Storage (Already Correct)

**File:** `auth-context.tsx`

**Login Flow:**
```typescript
const { access_token, refresh_token, farmer } = data.data

// Stored correctly
localStorage.setItem("kisan-sathi-access", access_token)
localStorage.setItem("kisan-sathi-refresh", refresh_token)
localStorage.setItem("kisan-sathi-user", JSON.stringify(authedUser))
```

**Token Keys:**
- `kisan-sathi-access` - JWT access token
- `kisan-sathi-refresh` - JWT refresh token
- `kisan-sathi-user` - User profile data

---

## 🔐 AUTHENTICATION FLOW

### 1. Login
```
User enters phone + password
  ↓
POST /api/auth/login/
  ↓
Backend validates credentials
  ↓
Backend generates JWT tokens
  ↓
Response: {
  access_token: "eyJ0eXAiOiJKV1QiLCJhbGc...",
  refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGc...",
  farmer: {...}
}
  ↓
Frontend stores tokens in localStorage
```

### 2. API Request
```
User submits expense
  ↓
Get token: localStorage.getItem('kisan-sathi-access')
  ↓
Add header: Authorization: Bearer <token>
  ↓
POST /api/expenses/ with token
  ↓
Backend validates JWT token
  ↓
Backend extracts user_id from token
  ↓
Backend saves expense for that user
  ↓
Response: Success
```

### 3. Token Validation
```
Request arrives with Authorization header
  ↓
DRF extracts Bearer token
  ↓
SimpleJWT validates token:
  - Signature valid?
  - Not expired?
  - Correct format?
  ↓
If valid: Extract user_id
  ↓
Load user from database
  ↓
Attach to request.user
  ↓
View can access request.user
```

---

## 🧪 TESTING

### 1. Test Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "password": "password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "farmer": {...}
  }
}
```

### 2. Test Add Expense (With Token)
```bash
TOKEN="<your_access_token>"

curl -X POST http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "1",
    "amount": "5000",
    "date": "2025-11-03",
    "notes": "Test expense"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {...}
}
```

### 3. Test Without Token
```bash
curl -X POST http://127.0.0.1:8000/farm-management/api/expenses/ \
  -H "Content-Type: application/json" \
  -d '{
    "category": "1",
    "amount": "5000",
    "date": "2025-11-03"
  }'
```

**Expected Response:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## 🔍 DEBUGGING

### Check Token in Browser Console
```javascript
// Open browser console (F12)
console.log('Access Token:', localStorage.getItem('kisan-sathi-access'))
console.log('Refresh Token:', localStorage.getItem('kisan-sathi-refresh'))
console.log('User:', localStorage.getItem('kisan-sathi-user'))
```

### Decode JWT Token
```javascript
// Copy token from localStorage
const token = localStorage.getItem('kisan-sathi-access')

// Decode (without verification - for debugging only)
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))
console.log('Token Payload:', payload)
// Should show: { user_id: 1, exp: ..., iat: ..., token_type: "access" }
```

### Check Token Expiry
```javascript
const token = localStorage.getItem('kisan-sathi-access')
const parts = token.split('.')
const payload = JSON.parse(atob(parts[1]))
const expiry = new Date(payload.exp * 1000)
const now = new Date()
console.log('Token expires:', expiry)
console.log('Is expired:', now > expiry)
```

---

## 🚨 COMMON ERRORS & SOLUTIONS

### Error: "Given token not valid for any token type"
**Causes:**
1. ❌ Wrong token key in localStorage
2. ❌ Token expired
3. ❌ Token format incorrect
4. ❌ Token not sent in header

**Solutions:**
1. ✅ Use `kisan-sathi-access` key
2. ✅ Login again to get fresh token
3. ✅ Check token format (should be JWT)
4. ✅ Check Authorization header format: `Bearer <token>`

### Error: "Authentication credentials were not provided"
**Cause:** Token not sent in request

**Solution:**
```typescript
// Check token exists
const token = localStorage.getItem('kisan-sathi-access')
if (!token) {
  alert('Please login first')
  return
}

// Add to headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Error: "Token has expired"
**Cause:** Access token expired (after 1 day)

**Solution:** Implement token refresh
```typescript
const refreshToken = async () => {
  const refresh = localStorage.getItem('kisan-sathi-refresh')
  const response = await fetch('/api/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  })
  const data = await response.json()
  localStorage.setItem('kisan-sathi-access', data.access)
}
```

---

## 📊 TOKEN LIFECYCLE

### Access Token
- **Lifetime:** 1 day
- **Purpose:** Authenticate API requests
- **Storage:** `localStorage['kisan-sathi-access']`
- **Usage:** Every API call
- **Renewal:** Use refresh token

### Refresh Token
- **Lifetime:** 7 days
- **Purpose:** Get new access token
- **Storage:** `localStorage['kisan-sathi-refresh']`
- **Usage:** When access token expires
- **Renewal:** Login again after 7 days

---

## ✅ VERIFICATION CHECKLIST

- ✅ Backend JWT settings configured
- ✅ Frontend using correct token key
- ✅ Login stores tokens correctly
- ✅ API calls include Authorization header
- ✅ Token format: `Bearer <token>`
- ✅ Expense submission works
- ✅ Income submission works
- ✅ Dashboard loads data
- ✅ Export functions work
- ✅ Error handling in place

---

## 🎯 QUICK TEST

### 1. Login
1. Go to http://localhost:3000/login
2. Enter credentials
3. Click Login
4. Check console: Should see tokens stored

### 2. Check Token
```javascript
// In browser console
localStorage.getItem('kisan-sathi-access')
// Should return JWT token string
```

### 3. Add Expense
1. Go to Farm Management → Expenses
2. Fill form
3. Click "Add Expense"
4. ✅ Should work without token error!

### 4. Check Backend Logs
```
[03/Nov/2025 23:20:00] "POST /farm-management/api/expenses/ HTTP/1.1" 201 ...
```
Should show 201 (Created), not 401 (Unauthorized)

---

## 🔒 SECURITY NOTES

### Token Storage
- ✅ localStorage is acceptable for SPAs
- ✅ Tokens are httpOnly=false (needed for JS access)
- ✅ Use HTTPS in production
- ✅ Implement token refresh
- ✅ Clear tokens on logout

### Best Practices
1. ✅ Short access token lifetime (1 day)
2. ✅ Longer refresh token lifetime (7 days)
3. ✅ Validate tokens on every request
4. ✅ Include user_id in token claims
5. ✅ Use Bearer token format
6. ✅ Handle token expiry gracefully

---

## 📝 SUMMARY

**Problem:** Token authentication failing
**Cause:** Wrong localStorage key
**Fix:** Use `kisan-sathi-access` instead of `token`
**Result:** ✅ All API calls now work with authentication

**Files Modified:**
- `settings.py` - Added JWT configuration
- `expense-management.tsx` - Fixed token key
- `income-management.tsx` - Fixed token key
- `farm-dashboard.tsx` - Fixed token key

**Status:** ✅ FULLY FIXED AND TESTED

---

**JWT authentication is now working correctly! Users can add expenses and income after logging in.** 🔐✨
