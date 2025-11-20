# 🔌 Admin Dashboard Backend Integration Guide

## ✅ What I Created

### 1. Django Backend API Endpoints
Created `farmers/admin_views.py` with 4 admin endpoints:

#### **GET /api/farmers/admin/stats/**
Returns dashboard statistics:
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "active_users": 890,
    "farmers_count": 650,
    "buyers_count": 600,
    "new_signups_today": 8,
    "active_today": 42,
    "total_transactions": 3420,
    "revenue": 245000
  }
}
```

#### **GET /api/farmers/admin/users/**
Returns list of all users with filters:
- Query params: `?role=farmer&status=active&search=john`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "district": "Bengaluru",
      "village": "Whitefield",
      "role": "farmer",
      "joinDate": "2025-01-15",
      "lastLogin": "2025-01-28 10:30 AM",
      "status": "active",
      "loginCount": 45,
      "is_verified": true
    }
  ],
  "count": 1
}
```

#### **GET /api/farmers/admin/activity/**
Returns user activity and recent signups:
```json
{
  "success": true,
  "data": {
    "stats": {
      "logins_today": 156,
      "signups_today": 8,
      "active_now": 42,
      "avg_session_time": 24
    },
    "recent_logins": [...],
    "recent_signups": [...]
  }
}
```

#### **GET/PUT/DELETE /api/farmers/admin/users/{id}/**
Manage specific user:
- GET: Get user details
- PUT: Update user
- DELETE: Delete user

### 2. Next.js API Client
Created `lib/admin-api.ts` with functions:
- `adminApi.getStats()` - Get dashboard stats
- `adminApi.getUsers(filters)` - Get users list
- `adminApi.getActivity()` - Get activity data
- `adminApi.getUserDetail(id)` - Get user details
- `adminApi.updateUser(id, data)` - Update user
- `adminApi.deleteUser(id)` - Delete user

## 🚀 How to Connect

### Step 1: Start Django Backend

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

Backend will run on: **http://localhost:8000**

### Step 2: Configure Next.js Environment

Create `.env.local` in Next.js app:

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
```

Create file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Update Admin Dashboard to Use Real API

Replace mock data in `app/admin/page.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { adminApi, type AdminStats, type User, type UserActivity } from "@/lib/admin-api"
// ... other imports

function AdminContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity" | "transactions" | "content">("overview")
  const [userFilter, setUserFilter] = useState<"all" | "farmer" | "buyer">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  // State for real data
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [activity, setActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Load data when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [userFilter, statusFilter, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, usersData, activityData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getActivity(),
      ])
      
      setStats(statsData.data)
      setUsers(usersData.data)
      setActivity(activityData.data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const filters = {
        role: userFilter !== 'all' ? userFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }
      const response = await adminApi.getUsers(filters)
      setUsers(response.data)
    } catch (err: any) {
      console.error('Error loading users:', err)
    }
  }

  // ... rest of component
}
```

### Step 4: Test the Connection

1. **Start both servers:**
```bash
# Terminal 1 - Django
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver

# Terminal 2 - Next.js
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
```

2. **Visit admin dashboard:**
```
http://localhost:3000/admin
```

3. **Check browser console:**
- Open DevTools (F12)
- Go to Network tab
- Should see API calls to `http://localhost:8000/api/farmers/admin/...`

## 🔐 Authentication

The admin endpoints require:
1. **Authentication:** User must be logged in (JWT token)
2. **Admin Permission:** User must have `is_staff=True` or `is_superuser=True`

### Create Admin User

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py createsuperuser
```

Follow prompts to create admin account.

### Login as Admin

1. Login through your app
2. Token will be stored in localStorage
3. All admin API calls will include this token

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Add CORS headers in Django `settings.py`:

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
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

Install cors headers:
```bash
pip install django-cors-headers
```

### Issue: 401 Unauthorized

**Solution:** 
1. Make sure you're logged in
2. Check token in localStorage
3. Verify user has admin permissions

### Issue: 403 Forbidden

**Solution:**
User doesn't have admin permissions. Set in Django admin:
```python
user.is_staff = True
user.is_superuser = True
user.save()
```

### Issue: Connection Refused

**Solution:**
1. Make sure Django server is running
2. Check API_URL in `.env.local`
3. Verify port 8000 is not blocked

## 📊 Data Flow

```
Next.js Admin Dashboard
        ↓
    adminApi.getStats()
        ↓
    HTTP GET /api/farmers/admin/stats/
        ↓
    Django AdminStatsView
        ↓
    Query Database
        ↓
    Return JSON Response
        ↓
    Update React State
        ↓
    Display in UI
```

## 🔄 Real-Time Updates

To add real-time updates:

### Option 1: Polling
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadData()
  }, 30000) // Refresh every 30 seconds
  
  return () => clearInterval(interval)
}, [])
```

### Option 2: WebSockets
Use Django Channels for real-time updates.

## 📝 Next Steps

1. ✅ **Test API endpoints** - Use Postman or curl
2. ✅ **Update admin page** - Replace mock data with API calls
3. ✅ **Add error handling** - Show user-friendly error messages
4. ✅ **Add loading states** - Show spinners while loading
5. ✅ **Test filters** - Verify role and status filters work
6. ✅ **Test pagination** - Add pagination for large user lists
7. ✅ **Add search** - Implement user search functionality

## 🎯 Complete Example

Here's a complete example of the Overview tab with real data:

```typescript
{activeTab === "overview" && (
  <div>
    <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h2>

    {loading ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    ) : error ? (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">Error: {error}</p>
        <Button onClick={loadData} className="mt-2">Retry</Button>
      </div>
    ) : stats ? (
      <>
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Users</p>
            <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Users</p>
            <p className="text-3xl font-bold text-foreground">{stats.active_users}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Transactions</p>
            <p className="text-3xl font-bold text-foreground">{stats.total_transactions}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Revenue</p>
            <p className="text-3xl font-bold text-foreground">₹{stats.revenue / 1000}K</p>
          </Card>
        </div>
      </>
    ) : null}
  </div>
)}
```

## ✅ Summary

You now have:
- ✅ Django API endpoints for admin data
- ✅ Next.js API client functions
- ✅ Type definitions for TypeScript
- ✅ Authentication handling
- ✅ Error handling
- ✅ Filter support
- ✅ Complete integration guide

**Next:** Update the admin dashboard component to use these API calls instead of mock data!

---

**Status:** ✅ READY TO INTEGRATE
**Backend:** ✅ API ENDPOINTS CREATED
**Frontend:** ✅ API CLIENT READY
