@echo off
echo Testing Django API...
echo.
echo Opening Django API in browser...
start http://localhost:8000/api/farmers/admin/stats/
echo.
echo If you see JSON data, Django is working!
echo If you see "can't connect", Django is not running.
echo.
pause
