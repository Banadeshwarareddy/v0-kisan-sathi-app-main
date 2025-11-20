# 🚀 Kisan Sathi - Production Deployment Guide

## Overview

This guide will help you deploy Kisan Sathi to production servers.

---

## 📋 Prerequisites

### Required:
- Ubuntu 20.04+ or similar Linux server
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (or MySQL 8+)
- Nginx
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

### Recommended:
- 4GB+ RAM
- 2+ CPU cores
- 50GB+ storage
- CDN (Cloudflare/AWS CloudFront)
- Object storage (AWS S3/DigitalOcean Spaces)

---

## 🔧 Backend Deployment (Django)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv nginx postgresql postgresql-contrib -y

# Install Redis (for caching)
sudo apt install redis-server -y
```

### 2. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres psql

CREATE DATABASE kisan_sathi;
CREATE USER kisan_user WITH PASSWORD 'your_secure_password';
ALTER ROLE kisan_user SET client_encoding TO 'utf8';
ALTER ROLE kisan_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kisan_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE kisan_sathi TO kisan_user;
\q
```

### 3. Application Setup

```bash
# Create application directory
sudo mkdir -p /var/www/kisan-sathi
cd /var/www/kisan-sathi

# Clone repository
git clone your-repo-url backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### 4. Environment Configuration

```bash
# Create .env file
nano kisan_sathi_backend/.env
```

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgresql://kisan_user:your_secure_password@localhost:5432/kisan_sathi

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS S3 (for media files)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=kisan-sathi-media
AWS_S3_REGION_NAME=us-east-1

# API Keys
GROQ_API_KEY=your-groq-api-key
WEATHER_API_KEY=your-weather-api-key

# Security
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 5. Django Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test server
python manage.py runserver 0.0.0.0:8000
```

### 6. Gunicorn Configuration

```bash
# Create Gunicorn config
nano /etc/systemd/system/gunicorn.service
```

```ini
[Unit]
Description=Gunicorn daemon for Kisan Sathi
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/kisan-sathi/backend/kisan_sathi_backend
Environment="PATH=/var/www/kisan-sathi/backend/venv/bin"
ExecStart=/var/www/kisan-sathi/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/kisan-sathi/backend/gunicorn.sock \
          kisan_sathi.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Start Gunicorn
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

### 7. Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/kisan-sathi
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    client_max_body_size 100M;
    
    location /static/ {
        alias /var/www/kisan-sathi/backend/staticfiles/;
    }
    
    location /media/ {
        alias /var/www/kisan-sathi/backend/media/;
    }
    
    location / {
        proxy_pass http://unix:/var/www/kisan-sathi/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kisan-sathi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🎨 Frontend Deployment (Next.js)

### 1. Build Setup

```bash
cd /var/www/kisan-sathi
git clone your-repo-url frontend
cd frontend/v0-kisan-sathi-app

# Install dependencies
npm install

# Create .env.local
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
```

### 2. Build Application

```bash
# Build for production
npm run build

# Test build
npm start
```

### 3. PM2 Setup

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "kisan-sathi-frontend" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### 4. Nginx Configuration for Frontend

```bash
sudo nano /etc/nginx/sites-available/kisan-sathi-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kisan-sathi-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Security Hardening

### 1. Firewall

```bash
# Configure UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2Ban

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Database Security

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change to:
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
```

---

## 📊 Monitoring Setup

### 1. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y
```

### 2. Application Monitoring

```bash
# Django logging
# Add to settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/kisan-sathi/django.log',
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

### 3. Nginx Logs

```bash
# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 Backup Strategy

### 1. Database Backup

```bash
# Create backup script
nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/kisan-sathi"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U kisan_user kisan_sathi > $BACKUP_DIR/db_$DATE.sql
gzip $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-db.sh

# Add to crontab
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

### 2. Media Files Backup

```bash
# Sync to S3
aws s3 sync /var/www/kisan-sathi/backend/media/ s3://kisan-sathi-backup/media/
```

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] Code reviewed and tested
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Static files collected
- [ ] SSL certificate obtained
- [ ] Backup strategy in place

### Deployment:
- [ ] Pull latest code
- [ ] Run migrations
- [ ] Collect static files
- [ ] Restart services
- [ ] Clear cache
- [ ] Test all endpoints

### Post-Deployment:
- [ ] Monitor logs
- [ ] Check error rates
- [ ] Verify functionality
- [ ] Update documentation
- [ ] Notify team

---

## 🔧 Maintenance Commands

```bash
# Restart Django
sudo systemctl restart gunicorn

# Restart Frontend
pm2 restart kisan-sathi-frontend

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo journalctl -u gunicorn -f
pm2 logs kisan-sathi-frontend

# Database backup
/usr/local/bin/backup-db.sh

# Clear cache
python manage.py clear_cache
```

---

## 📈 Performance Optimization

### 1. Database

```sql
-- Add indexes
CREATE INDEX idx_farmer_user ON farmers_farmerprofile(user_id);
CREATE INDEX idx_product_category ON marketplace_product(category_id);
```

### 2. Caching

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### 3. CDN

- Use Cloudflare for static assets
- Enable Gzip compression
- Optimize images
- Lazy load images

---

## 🎉 Success!

Your Kisan Sathi application is now deployed to production!

**Access URLs:**
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- Admin: https://api.yourdomain.com/admin

**Next Steps:**
1. Monitor application performance
2. Set up analytics
3. Configure email notifications
4. Enable backup automation
5. Plan scaling strategy

---

*For support, refer to the documentation or contact the development team.*
