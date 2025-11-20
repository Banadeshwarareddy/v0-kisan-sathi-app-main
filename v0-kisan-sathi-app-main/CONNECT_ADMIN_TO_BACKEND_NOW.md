# 🔌 Connect Admin Dashboard to Backend - Step by Step

Follow these steps **in order**:

## Step 1: Install CORS (5 minutes)

### 1.1 Install Package
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
pip install django-cors-headers
```

### 1.2 Update Django Settings

Open `kisan_sathi_backend/kisan_sathi/settings.py` and add:

**Find `INSTALLED_APPS` and add:**
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',  # ← ADD THIS LINE
    'farmers',
    'farm_management',
    'marketplace',
    'chatbot',
]
```

**Find `MIDDLEWARE` and add at the TOP:**
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← ADD THIS LINE AT TOP
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

**Add at the END of settings.py:**
```python
# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

## Step 2: Create .env.local for Next.js (2 minutes)

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
```

Create file `.env.local` with this content:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**On Windows PowerShell:**
```powershell
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

**On Windows CMD:**
```cmd
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
```

## Step 3: Start Django Server (2 minutes)

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

**You should see:**
```
Starting development server at http://127.0.0.1:8000/
```

**Keep this terminal open!**

## Step 4: Start Next.js Server (2 minutes)

**Open a NEW terminal:**

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
```

**You should see:**
```
- Local:        http://localhost:3000
```

**Keep this terminal open too!**

## Step 5: Test the Connection (1 minute)

1. Open browser: http://localhost:3000/admin
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for requests to `localhost:8000/api/farmers/admin/...`

**If you see these requests, it's working!** ✅

## Step 6: Create Test Users (Optional - 3 minutes)

To see real data, create some test users:

```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py shell
```

Then paste this:
```python
from farmers.models import Farmer
from django.utils import timezone

# Create test farmer
Farmer.objects.create(
    phone="+919876543210",
    first_name="Ramesh",
    last_name="Kumar",
    email="ramesh@example.com",
    district="Bengaluru",
    village="Whitefield",
    user_type="farmer",
    is_verified=True,
    last_login=timezone.now()
)

# Create test buyer
Farmer.objects.create(
    phone="+919876543211",
    first_name="Priya",
    last_name="Singh",
    email="priya@example.com",
    district="Mysuru",
    village="Gokulam",
    user_type="buyer",
    is_verified=True,
    last_login=timezone.now()
)

print("✅ Test users created!")
exit()
```

## Troubleshooting

### Error: "No module named 'corsheaders'"
**Solution:** Run `pip install django-cors-headers`

### Error: "CORS policy blocked"
**Solution:** Make sure you added CORS settings to `settings.py`

### Error: "Connection refused"
**Solution:** Make sure Django server is running on port 8000

### Error: "404 Not Found"
**Solution:** Check that admin URLs are added to `farmers/urls.py`

### Still seeing "An error occurred"?
**Solution:** 
1. Check Django terminal for errors
2. Check browser console (F12) for error messages
3. Make sure `.env.local` file exists in Next.js folder

## Verify It's Working

### In Browser Console (F12):
You should see successful API calls:
```
GET http://localhost:8000/api/farmers/admin/stats/ 200 OK
GET http://localhost:8000/api/farmers/admin/users/ 200 OK
GET http://localhost:8000/api/farmers/admin/activity/ 200 OK
```

### In Django Terminal:
You should see:
```
[06/Nov/2025 10:30:15] "GET /api/farmers/admin/stats/ HTTP/1.1" 200 156
[06/Nov/2025 10:30:15] "GET /api/farmers/admin/users/ HTTP/1.1" 200 1024
```

## Success! 🎉

If you see:
- ✅ No error message on admin page
- ✅ Real user count from database
- ✅ API calls in Network tab
- ✅ No CORS errors

**You're connected!**

---

## Quick Commands Reference

**Start Django:**
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

**Start Next.js:**
```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
```

**Both servers must be running at the same time!**

---

**Need help?** Check:
- `ADMIN_BACKEND_INTEGRATION_GUIDE.md` - Detailed guide
- `QUICK_START_ADMIN_BACKEND.md` - Quick reference
