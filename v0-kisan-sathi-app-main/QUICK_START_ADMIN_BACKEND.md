# 🚀 Quick Start: Connect Admin Dashboard to Backend

## ⚡ 5-Minute Setup

### Step 1: Start Django Backend (1 min)

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

✅ Backend running on: http://localhost:8000

### Step 2: Configure Next.js (1 min)

Create `.env.local` file:

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### Step 3: Install CORS (if needed) (1 min)

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
pip install django-cors-headers
```

Add to `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Step 4: Create Admin User (1 min)

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py createsuperuser
```

### Step 5: Start Next.js (1 min)

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
```

✅ Frontend running on: http://localhost:3000

## 🧪 Test It

1. Visit: http://localhost:3000/admin
2. Open browser DevTools (F12)
3. Go to Network tab
4. Should see API calls to backend

## 📝 What You Have Now

✅ **4 Admin API Endpoints:**
- GET `/api/farmers/admin/stats/` - Dashboard statistics
- GET `/api/farmers/admin/users/` - All users list
- GET `/api/farmers/admin/activity/` - Login activity
- GET/PUT/DELETE `/api/farmers/admin/users/{id}/` - User management

✅ **Next.js API Client:**
- `adminApi.getStats()` - Get stats
- `adminApi.getUsers(filters)` - Get users
- `adminApi.getActivity()` - Get activity
- `adminApi.getUserDetail(id)` - Get user
- `adminApi.updateUser(id, data)` - Update user
- `adminApi.deleteUser(id)` - Delete user

## 🔧 Update Admin Page

See `ADMIN_INTEGRATION_EXAMPLE.tsx` for complete code example.

Key changes:
1. Import `adminApi` from `@/lib/admin-api`
2. Replace mock data with state variables
3. Add `useEffect` to load data
4. Add loading and error states
5. Use real data in JSX

## ✅ Done!

Your admin dashboard is now connected to the real backend!

---

**Need help?** Check `ADMIN_BACKEND_INTEGRATION_GUIDE.md` for detailed instructions.
