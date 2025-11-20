# Servers Running! 🚀

## Status

✅ **Next.js Frontend** - Running on http://localhost:3000
✅ **Django Backend** - Running on http://localhost:8000

## Access URLs

### Next.js Frontend
- **Homepage**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Farm Management**: http://localhost:3000/farm-management
- **Marketplace**: http://localhost:3000/marketplace
- **Chatbot**: http://localhost:3000/chatbot
- **Weather**: http://localhost:3000/weather

### Django Backend
- **Admin Panel**: http://localhost:8000/admin/
- **Farm Management**: http://localhost:8000/farm-management/
- **Marketplace**: http://localhost:8000/marketplace/
- **API Root**: http://localhost:8000/api/

## Your Admin Credentials

```
Phone: +916366673457
Email: banadeshwarareddyreddy@gmail.com
Password: Bannu@123
```

## Quick Start

### 1. Login to Next.js
1. Go to http://localhost:3000/login
2. Enter phone: `+916366673457`
3. Enter password: `Bannu@123`
4. Click Login

### 2. Explore Features
- **Dashboard** - Overview of all features
- **Farm Management** - Track expenses, income, inventory
- **Marketplace** - Browse and add products
- **Chatbot** - AI farming assistant
- **Weather** - Real-time weather updates

### 3. Django Admin (Alternative)
1. Go to http://localhost:8000/admin/
2. Login with same credentials
3. Manage all data directly

## Server Logs

### Next.js (Process ID: 3)
- Compiled successfully
- Serving on port 3000
- Hot reload enabled

### Django (Process ID: 2)
- Running on port 8000
- API endpoints active
- Database connected

## Note: 403 Error on Product Creation

If you see a 403 error when adding products, this is a permission issue. The user needs to have a FarmerProfile. Let me check and fix this:

### Quick Fix:
Run this in Django shell:
```python
python manage.py shell
```

Then:
```python
from farmers.models import Farmer
from marketplace.models import FarmerProfile

farmer = Farmer.objects.get(phone='+916366673457')

# Create farmer profile if doesn't exist
if not hasattr(farmer, 'farmer_profile'):
    FarmerProfile.objects.create(
        user=farmer,
        farm_name="My Farm",
        verification_status='verified'
    )
    print("Farmer profile created!")
else:
    print("Farmer profile already exists")
```

## Stop Servers

To stop the servers, use these commands in terminal:
```bash
# Stop Next.js
Ctrl+C in the Next.js terminal

# Stop Django
Ctrl+C in the Django terminal
```

Or I can stop them for you - just ask!

## Troubleshooting

### Can't access http://localhost:3000
- Check if Next.js server is running
- Look for errors in the terminal
- Try refreshing the page

### Can't access http://localhost:8000
- Check if Django server is running
- Make sure virtual environment is activated
- Check for port conflicts

### Authentication errors
- Make sure you're logged in
- Check browser console for token
- Clear localStorage and login again

---

**Both servers are running and ready to use!** 🎉

Just login at http://localhost:3000/login and start exploring!
