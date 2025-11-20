# Deployment Guide

Complete guide for deploying Kisan Sathi to production.

## Prerequisites

- Domain name
- SSL certificate
- Server with Python 3.8+ and Node.js 16+
- PostgreSQL database
- Nginx or Apache web server

## Backend Deployment (Django)

### 1. Prepare Environment

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv postgresql nginx -y
```

### 2. Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE kisan_sathi;
CREATE USER kisan_user WITH PASSWORD 'your_secure_password';
ALTER ROLE kisan_user SET client_encoding TO 'utf8';
ALTER ROLE kisan_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kisan_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE kisan_sathi TO kisan_user;
\q
```

### 3. Configure Django

Update `settings.py`:

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'kisan_sathi',
        'USER': 'kisan_user',
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
```

### 4. Deploy with Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/kisan_sathi.service
```

Add:
```ini
[Unit]
Description=Kisan Sathi Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/kisan_sathi_backend
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 kisan_sathi.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start kisan_sathi
sudo systemctl enable kisan_sathi
```

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/kisan_sathi
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /static/ {
        alias /path/to/kisan_sathi_backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/kisan_sathi_backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kisan_sathi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. Deploy!

### Option 2: Self-Hosted

```bash
# Build production
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "kisan-sathi-frontend" -- start
pm2 save
pm2 startup
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://kisan_user:password@localhost/kisan_sathi
GROQ_API_KEY=your-groq-api-key
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Post-Deployment Checklist

- [ ] Run migrations: `python manage.py migrate`
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Test all endpoints
- [ ] Setup monitoring (Sentry, New Relic)
- [ ] Configure backups
- [ ] Setup CDN for static files
- [ ] Enable HTTPS
- [ ] Test mobile responsiveness
- [ ] Setup email service (SendGrid, AWS SES)

## Monitoring

### Setup Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/kisan_sathi/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

## Backup Strategy

```bash
# Database backup
pg_dump kisan_sathi > backup_$(date +%Y%m%d).sql

# Automated daily backups
0 2 * * * /path/to/backup_script.sh
```

## Scaling

- Use Redis for caching
- Setup load balancer
- Use CDN for static files
- Database read replicas
- Horizontal scaling with Docker/Kubernetes

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (ufw)
- [ ] Regular security updates
- [ ] Rate limiting on API
- [ ] CORS configuration
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF tokens enabled

## Support

For deployment issues, contact: devops@kisansathi.com
