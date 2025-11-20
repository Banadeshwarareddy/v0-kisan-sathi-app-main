# 🔍 Test PDF Download - Troubleshooting Steps

## Step 1: Check if you're logged in

1. Go to http://127.0.0.1:8000/farm-management/
2. Make sure you see your name/username at the top
3. If not logged in, login first

## Step 2: Open Browser Console

1. Press **F12** on your keyboard
2. Click on the **Console** tab
3. Keep it open

## Step 3: Try to download PDF

1. Click the **"Export PDF"** button on the dashboard
2. Look at the console for any error messages

## Common Issues & Solutions

### Issue 1: "403 Forbidden" or "401 Unauthorized"
**Solution**: You're not logged in
- Go to http://127.0.0.1:8000/admin/
- Login with your credentials
- Then try again

### Issue 2: "404 Not Found"
**Solution**: URL is wrong
- Check the console to see what URL it's trying to access
- Should be: `/farm-management/api/export/analytics/pdf/`

### Issue 3: "500 Internal Server Error"
**Solution**: Check Django server console for error details
- Look at the terminal where Django is running
- You'll see the full error traceback

### Issue 4: Nothing happens / No error
**Solution**: Check if popup is blocked
- Look for a popup blocker icon in your browser address bar
- Allow popups for this site

## Step 4: Manual Test

Try accessing the URL directly:

1. Make sure you're logged in at http://127.0.0.1:8000/admin/
2. Then open this URL in a new tab:
   ```
   http://127.0.0.1:8000/farm-management/api/export/analytics/pdf/?year=2025
   ```
3. The PDF should download automatically

## Step 5: Check if you have data

The PDF needs data to generate. Check if you have:
- Income records
- Expense records

To add test data:
```bash
cd v0-kisan-sathi-app-main/kisan_sathi_backend
.\venv\Scripts\Activate.ps1
python manage.py seed_farm_data
```

## What to tell me

Please tell me:
1. ✅ Are you logged in? (Yes/No)
2. ✅ What error do you see in the console? (Copy the exact message)
3. ✅ What happens when you click the button? (Nothing/Error/Popup blocked/etc)
4. ✅ Can you access the URL directly? (Yes/No)

This will help me fix the exact issue you're facing!
