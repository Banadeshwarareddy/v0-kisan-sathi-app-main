# Token Debug Guide - Quick Fix

## 🚨 ERROR: "Given token not valid for any token type"

This error means you're either **not logged in** or your **token is invalid/expired**.

---

## ✅ QUICK FIX (3 Steps)

### Step 1: Check if You're Logged In

**Open Browser Console (F12) and run:**
```javascript
console.log('Token:', localStorage.getItem('kisan-sathi-access'))
console.log('User:', localStorage.getItem('kisan-sathi-user'))
```

**Result:**
- If both are `null` → **You're NOT logged in** → Go to Step 2
- If token exists → **You ARE logged in** → Go to Step 3

---

### Step 2: Login First

**You MUST login before using Farm Management!**

1. Go to http://localhost:3000/login
2. Enter your credentials:
   - Phone: Your registered phone number
   - Password: Your password
3. Click "Login"
4. After successful login, go back to Farm Management
5. Try adding expense again

**Don't have an account?**
1. Go to http://localhost:3000/signup
2. Register a new account
3. Then login

---

### Step 3: Token is Invalid (Clear and Re-login)

If you have a token but still getting error, it might be expired or invalid.

**Clear tokens and login again:**

**In Browser Console (F12):**
```javascript
localStorage.removeItem('kisan-sathi-access')
localStorage.removeItem('kisan-sathi-refresh')
localStorage.removeItem('kisan-sathi-user')
console.log('Tokens cleared! Now login again.')
```

Then:
1. Refresh the page
2. Go to /login
3. Login again
4. Try Farm Management

---

## 🔍 DETAILED DEBUGGING

### Check Token Validity

**In Browser Console:**
```javascript
const token = localStorage.getItem('kisan-sathi-access')

if (!token) {
  console.log('❌ NO TOKEN - You need to login!')
} else {
  console.log('✅ Token exists')
  
  // Decode token
  try {
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    console.log('Token Payload:', payload)
    
    // Check expiry
    const expiry = new Date(payload.exp * 1000)
    const now = new Date()
    console.log('Expires:', expiry)
    console.log('Now:', now)
    console.log('Is Expired:', now > expiry)
    
    if (now > expiry) {
      console.log('❌ TOKEN EXPIRED - Login again!')
    } else {
      console.log('✅ Token is valid')
    }
  } catch (e) {
    console.log('❌ INVALID TOKEN FORMAT - Login again!')
  }
}
```

---

## 🎯 COMMON SCENARIOS

### Scenario 1: First Time User
**Problem:** Never logged in before
**Solution:** 
1. Go to /signup
2. Create account
3. Go to /login
4. Login
5. Use Farm Management

### Scenario 2: Token Expired
**Problem:** Logged in yesterday, token expired (1 day lifetime)
**Solution:**
1. Clear tokens (see Step 3 above)
2. Login again
3. Use Farm Management

### Scenario 3: Logged Out
**Problem:** Clicked logout or cleared browser data
**Solution:**
1. Go to /login
2. Login again
3. Use Farm Management

### Scenario 4: Different Browser/Incognito
**Problem:** Tokens stored in different browser/session
**Solution:**
1. Login in current browser
2. Use Farm Management

---

## 📊 VISUAL INDICATORS

### On Farm Management Page:

**If NOT logged in:**
```
⚠️ You are not logged in
Please login to add expenses and view your data.
```

**If logged in:**
- No warning message
- Forms work normally
- Data loads successfully

---

## 🧪 TEST YOUR LOGIN

### Test 1: Check Login Status
```javascript
// In browser console
const user = localStorage.getItem('kisan-sathi-user')
if (user) {
  console.log('✅ Logged in as:', JSON.parse(user).name)
} else {
  console.log('❌ Not logged in')
}
```

### Test 2: Test API with Token
```javascript
// In browser console
const token = localStorage.getItem('kisan-sathi-access')

fetch('http://127.0.0.1:8000/farm-management/api/expenses/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err))
```

**Expected Results:**
- If logged in: Returns array of expenses
- If not logged in: Returns 401 error

---

## 🔐 LOGIN CREDENTIALS

### For Testing:
If you don't have credentials, create a test account:

1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: Test Farmer
   - Phone: +919876543210
   - Email: test@example.com
   - Password: Test@123
   - District: Bangalore
   - Taluk: Bangalore North
   - Village: Test Village
3. Click "Sign Up"
4. Go to /login
5. Login with phone and password

---

## ⚡ QUICK COMMANDS

### Clear Everything and Start Fresh:
```javascript
// In browser console
localStorage.clear()
location.reload()
// Then go to /login
```

### Check All Storage:
```javascript
// In browser console
console.log('All localStorage:')
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  console.log(key, ':', localStorage.getItem(key))
}
```

---

## 🎯 STEP-BY-STEP SOLUTION

### If You See "Given token not valid" Error:

1. **Open Browser Console (F12)**

2. **Run this:**
   ```javascript
   localStorage.getItem('kisan-sathi-access')
   ```

3. **If it returns `null`:**
   - You're not logged in
   - Go to /login
   - Login
   - Come back to Farm Management

4. **If it returns a token string:**
   - Token might be expired
   - Run this:
     ```javascript
     localStorage.clear()
     ```
   - Go to /login
   - Login again
   - Come back to Farm Management

5. **Try adding expense again**
   - Should work now! ✅

---

## 📝 SUMMARY

**The error "Given token not valid" means:**
1. ❌ You're not logged in
2. ❌ Your token expired
3. ❌ Your token is invalid

**The solution is simple:**
1. ✅ Login at /login
2. ✅ Use Farm Management
3. ✅ If still fails, clear tokens and login again

---

**Most Common Issue:** Users trying to use Farm Management without logging in first!

**Solution:** Always login before using Farm Management features! 🔐
