# 🎯 Get Real Data in Admin Dashboard - EASY WAY

## The Easiest Way (Windows)

### Just Double-Click This File:
```
START_ADMIN_WITH_REAL_DATA.bat
```

This will:
1. Create `.env.local` automatically
2. Start Django in one window
3. Start Next.js in another window
4. Open both servers for you

**Then visit:** http://localhost:3000/admin

---

## Manual Way (If batch file doesn't work)

### Terminal 1 - Start Django:
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

**KEEP THIS RUNNING!**

### Terminal 2 - Create .env.local:
```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
```

### Terminal 2 - Start Next.js:
```bash
npm run dev
```

**KEEP THIS RUNNING TOO!**

### Visit Admin:
```
http://localhost:3000/admin
```

---

## Verify Django is Working

### Test 1: Open in Browser
```
http://localhost:8000/api/farmers/admin/stats/
```

**Should show:**
```json
{
  "success": true,
  "data": {
    "total_users": 0,
    ...
  }
}
```

### Test 2: Run Test Script
Double-click: `TEST_DJANGO_API.bat`

---

## If You Still See "Failed to Fetch"

### Check 1: Is Django Running?
Look for a window that says:
```
Starting development server at http://127.0.0.1:8000/
```

**If you don't see this window, Django isn't running!**

### Check 2: Can You Access Django?
Open: http://localhost:8000/api/farmers/admin/stats/

**If this doesn't work, Django has a problem.**

### Check 3: Does .env.local Exist?
```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
type .env.local
```

Should show:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Check 4: Restart Next.js
After creating `.env.local`, you MUST restart Next.js!

Press Ctrl+C in Next.js terminal, then:
```bash
npm run dev
```

---

## What You'll See With Real Data

### If Database is Empty:
- Total Users: 0
- Active Users: 0
- No users in the list

### To Add Test Data:
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py shell
```

Then paste:
```python
from farmers.models import Farmer
from django.utils import timezone

Farmer.objects.create(
    phone="+919876543210",
    first_name="Test",
    last_name="User",
    email="test@example.com",
    district="Bengaluru",
    user_type="farmer",
    is_verified=True,
    last_login=timezone.now()
)
print("✓ Test user created!")
exit()
```

Refresh admin page to see the new user!

---

## Summary

**Easiest:** Double-click `START_ADMIN_WITH_REAL_DATA.bat`

**Manual:**
1. Start Django: `python manage.py runserver`
2. Create `.env.local` with API URL
3. Start Next.js: `npm run dev`
4. Visit: http://localhost:3000/admin

**Both servers must run at the same time!**

---

**Status:** ✅ Scripts created
**Next:** Run the batch file or follow manual steps
