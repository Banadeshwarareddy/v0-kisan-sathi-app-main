# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Python Virtual Environment Not Activating

**Windows:**
```bash
# If activation fails, try:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Module Not Found Errors

```bash
# Backend
cd kisan_sathi_backend
pip install -r requirements.txt

# Frontend
cd v0-kisan-sathi-app
npm install
```

### Database Migration Errors

```bash
# Reset migrations
python manage.py migrate --fake
python manage.py migrate

# Or completely reset database
python manage.py flush
python manage.py migrate
```

---

## Server Issues

### Port Already in Use

**Django (Port 8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Next.js (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Django Server Won't Start

```bash
# Check for syntax errors
python manage.py check

# Run with verbose output
python manage.py runserver --verbosity 3

# Check database connection
python manage.py dbshell
```

### Next.js Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## Authentication Issues

### JWT Token Expired

**Solution:** Login again to get a new token.

```javascript
// Frontend: Implement token refresh
const refreshToken = async () => {
  const response = await fetch('/api/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken })
  });
  return response.json();
};
```

### CORS Errors

**Backend settings.py:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### 401 Unauthorized Errors

1. Check if token is included in request headers
2. Verify token hasn't expired
3. Ensure user has proper permissions

---

## Database Issues

### SQLite Database Locked

```bash
# Close all connections and restart server
python manage.py migrate
```

### PostgreSQL Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection settings in .env
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### Data Not Showing Up

```bash
# Seed sample data
python manage.py seed_farm_data
python manage.py seed_marketplace

# Check if migrations are applied
python manage.py showmigrations
```

---

## API Issues

### 404 Not Found

1. Check URL spelling
2. Verify API endpoint exists
3. Check URL patterns in `urls.py`

### 500 Internal Server Error

```bash
# Check Django logs
python manage.py runserver

# Enable DEBUG mode temporarily
DEBUG = True  # in settings.py

# Check error details in browser console
```

### Request Timeout

1. Check if backend server is running
2. Verify API_URL in frontend .env
3. Check network connectivity

---

## Frontend Issues

### Blank Page / White Screen

```bash
# Check browser console for errors
# Clear browser cache
# Rebuild Next.js
rm -rf .next
npm run dev
```

### Images Not Loading

1. Check image paths
2. Verify MEDIA_URL in Django settings
3. Ensure static files are served correctly

### Styling Issues

```bash
# Rebuild Tailwind CSS
npm run build

# Clear browser cache
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## Module-Specific Issues

### Farm Management

**Data not saving:**
- Check authentication token
- Verify user permissions
- Check browser console for errors

**Reports not generating:**
- Ensure data exists for the selected period
- Check PDF generation dependencies

### AI Soil Analyzer

**Analysis failing:**
- Verify GROQ_API_KEY in .env
- Check API rate limits
- Ensure all required fields are filled

**PDF download not working:**
- Check ReportLab installation: `pip install reportlab`
- Verify media directory permissions

### Marketplace

**Images not uploading:**
- Check MEDIA_ROOT in settings.py
- Verify file size limits
- Check file permissions

**Orders not processing:**
- Verify cart has items
- Check user authentication
- Ensure product stock is available

### Chatbot

**No response:**
- Check GROQ_API_KEY
- Verify API connectivity
- Check rate limits

**Voice not working:**
- Enable microphone permissions in browser
- Check browser compatibility
- Verify HTTPS connection (required for mic access)

---

## Performance Issues

### Slow Page Load

```bash
# Enable caching
# Backend
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# Optimize images
# Use CDN for static files
# Enable compression
```

### High Memory Usage

```bash
# Limit Django workers
gunicorn --workers 2 --threads 4

# Optimize database queries
# Use select_related() and prefetch_related()
```

---

## Development Issues

### Hot Reload Not Working

**Next.js:**
```bash
# Restart dev server
npm run dev

# Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Django:**
```bash
# Use --noreload flag to disable
python manage.py runserver --noreload
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Regenerate types
npm run build
```

---

## Production Issues

### Static Files Not Loading

```bash
# Collect static files
python manage.py collectstatic --noinput

# Check STATIC_ROOT and STATIC_URL in settings.py
```

### SSL Certificate Errors

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Database Connection Pool Exhausted

```python
# Increase pool size in settings.py
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'MAX_CONNS': 20
        }
    }
}
```

---

## Getting Help

If you can't resolve an issue:

1. **Check Logs:**
   - Django: Terminal output
   - Next.js: Browser console
   - Nginx: `/var/log/nginx/error.log`

2. **Search Documentation:**
   - Django: https://docs.djangoproject.com
   - Next.js: https://nextjs.org/docs

3. **Contact Support:**
   - Email: support@kisansathi.com
   - GitHub Issues: [Create an issue]

4. **Community:**
   - Stack Overflow
   - Django Forum
   - Next.js Discussions

---

## Debug Mode

### Enable Detailed Logging

**Backend (settings.py):**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

**Frontend:**
```javascript
// Add to next.config.js
module.exports = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

---

## Common Error Messages

### "CSRF token missing or incorrect"
**Solution:** Ensure CSRF token is included in POST requests

### "Permission denied"
**Solution:** Check user permissions and authentication

### "Connection refused"
**Solution:** Verify server is running and ports are correct

### "Module not found"
**Solution:** Install missing dependencies

### "Database is locked"
**Solution:** Close other connections to database
