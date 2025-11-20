# 🔧 Fix "Failed to Fetch" Error

## The Problem
"Failed to fetch" means Next.js can't connect to Django backend.

## Solution - Follow These Steps EXACTLY:

### Step 1: Is Django Running?

Open a terminal and run:
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
```

**You MUST see:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Keep this terminal open!** Don't close it.

### Step 2: Test Django Directly

Open your browser and go to:
```
http://localhost:8000/api/farmers/admin/stats/
```

**You should see JSON data like:**
```json
{
  "success": true,
  "data": {
    "total_users": 0,
    ...
  }
}
```

**If you see this, Django is working!** ✅

**If you see an error page or "can't connect":**
- Django isn't running
- Go back to Step 1

### Step 3: Create .env.local

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
```

**On Windows PowerShell:**
```powershell
Set-Content -Path ".env.local" -Value "NEXT_PUBLIC_API_URL=http://localhost:8000/api"
```

**On Windows CMD:**
```cmd
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
```

**Verify it was created:**
```bash
type .env.local
```

Should show:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 4: Start Next.js (NEW Terminal)

**Open a SECOND terminal** (keep Django running in first):

```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
```

**You should see:**
```
- Local:        http://localhost:3000
```

### Step 5: Visit Admin

Open browser:
```
http://localhost:3000/admin
```

**Error should be GONE!** ✅

## Still Getting "Failed to Fetch"?

### Check 1: Is Django Running?
Look at the Django terminal. You should see requests like:
```
[06/Nov/2025 10:30:15] "GET /api/farmers/admin/stats/ HTTP/1.1" 200 156
```

**If you don't see these, Django isn't running!**

### Check 2: Test Django URL Directly
Open: http://localhost:8000/api/farmers/admin/stats/

**If this doesn't work, Django has a problem.**

### Check 3: Check .env.local
```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
type .env.local
```

Must contain:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Check 4: Restart Next.js
After creating `.env.local`, you MUST restart Next.js:
```bash
# Press Ctrl+C to stop
# Then run again:
npm run dev
```

## Quick Checklist

- [ ] Django server is running on port 8000
- [ ] Can access http://localhost:8000/api/farmers/admin/stats/ in browser
- [ ] `.env.local` file exists in Next.js folder
- [ ] `.env.local` contains correct API URL
- [ ] Restarted Next.js after creating `.env.local`
- [ ] Next.js is running on port 3000
- [ ] Both terminals are still open

## Common Mistakes

❌ **Closing Django terminal** - Keep it open!
❌ **Not creating .env.local** - Must create it!
❌ **Not restarting Next.js** - Must restart after creating .env.local!
❌ **Wrong folder** - Make sure you're in the right directory!

## The Right Way

**Terminal 1 (Django):**
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
python manage.py runserver
# KEEP THIS RUNNING!
```

**Terminal 2 (Next.js):**
```bash
cd v0-kisan-sathi-app-main/v0-kisan-sathi-app
npm run dev
# KEEP THIS RUNNING TOO!
```

**Both must run at the same time!**

---

**Still stuck?** Tell me:
1. What do you see in Django terminal?
2. Can you open http://localhost:8000/api/farmers/admin/stats/ in browser?
3. Does `.env.local` file exist?
