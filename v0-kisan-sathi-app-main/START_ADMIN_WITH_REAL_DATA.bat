@echo off
echo ========================================
echo Starting Kisan Sathi Admin Dashboard
echo ========================================
echo.

echo Step 1: Creating .env.local for Next.js...
cd v0-kisan-sathi-app
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
echo ✓ Created .env.local
echo.

echo Step 2: Starting Django Backend...
cd ..\kisan_sathi_backend
start cmd /k "python manage.py runserver"
echo ✓ Django starting on http://localhost:8000
echo.

echo Waiting 5 seconds for Django to start...
timeout /t 5 /nobreak > nul
echo.

echo Step 3: Starting Next.js Frontend...
cd ..\v0-kisan-sathi-app
start cmd /k "npm run dev"
echo ✓ Next.js starting on http://localhost:3000
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Django Backend: http://localhost:8000
echo Next.js Frontend: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
