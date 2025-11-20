# Quick Start Guide

Get Kisan Sathi running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd kisan_sathi_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

✅ Backend running at: http://localhost:8000

## Step 2: Frontend Setup (2 minutes)

Open a NEW terminal:

```bash
# Navigate to frontend
cd v0-kisan-sathi-app

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```

✅ Frontend running at: http://localhost:3000

## Step 3: Seed Sample Data (1 minute)

Optional but recommended for testing:

```bash
# In backend terminal
python manage.py seed_farm_data
python manage.py seed_marketplace
```

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Next.js App | http://localhost:3000 | Register new user |
| Django Admin | http://localhost:8000/admin | Superuser credentials |
| Farm Management | http://localhost:8000/farm-management/dashboard/ | Any user |
| API Docs | http://localhost:8000/api/ | - |

## Test Credentials

After seeding data:
- **Username**: testfarmer
- **Password**: testpass123

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000 (Django)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 3000 (Next.js)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Database Errors
```bash
# Reset database
python manage.py flush
python manage.py migrate
```

## Next Steps

1. ✅ Create a user account at http://localhost:3000
2. ✅ Explore the farm management dashboard
3. ✅ Try the AI Soil Analyzer
4. ✅ Test the AI Crop Doctor
5. ✅ Browse the marketplace

## Need Help?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.
