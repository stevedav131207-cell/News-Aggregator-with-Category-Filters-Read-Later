# SAMACHAR - Live Server Deployment Guide

## 🚀 Deployment Options

### Option 1: PythonAnywhere (Easiest - Free Tier Available)
### Option 2: Heroku (Easy - Free Tier Available)
### Option 3: Railway (Modern - Free Tier Available)
### Option 4: DigitalOcean/AWS/VPS (Advanced - Paid)

---

## 🎯 Option 1: PythonAnywhere (Recommended for Beginners)

### Step 1: Create Account
1. Go to https://www.pythonanywhere.com/
2. Sign up for a free account
3. Verify your email

### Step 2: Upload Your Code
```bash
# On PythonAnywhere Bash Console
git clone https://github.com/stevedav131207-cell/News-Aggregator-with-Category-Filters-Read-Later.git
cd News-Aggregator-with-Category-Filters-Read-Later
```

### Step 3: Create Virtual Environment
```bash
mkvirtualenv --python=/usr/bin/python3.10 samachar-env
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
```bash
# Create .env file
nano .env

# Add your API keys:
NEWS_API_KEY=your_key_here
GUARDIAN_API_KEY=your_key_here
SECRET_KEY=your_secret_key_here
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com
```

### Step 5: Setup Database
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

### Step 6: Configure Web App
1. Go to "Web" tab in PythonAnywhere
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Choose Python 3.10
5. Set source code directory: `/home/yourusername/News-Aggregator-with-Category-Filters-Read-Later`
6. Set working directory: `/home/yourusername/News-Aggregator-with-Category-Filters-Read-Later`
7. Edit WSGI file:

```python
import os
import sys

path = '/home/yourusername/News-Aggregator-with-Category-Filters-Read-Later'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'samachar.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

8. Set virtualenv: `/home/yourusername/.virtualenvs/samachar-env`
9. Reload web app

### Step 7: Configure Static Files
In Web tab, add static files mapping:
- URL: `/static/`
- Directory: `/home/yourusername/News-Aggregator-with-Category-Filters-Read-Later/staticfiles`

### Step 8: Access Your Site
Visit: `https://yourusername.pythonanywhere.com`

---

## 🎯 Option 2: Heroku Deployment

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
heroku create samachar-news-app
```

### Step 4: Add Buildpack
```bash
heroku buildpacks:set heroku/python
```

### Step 5: Set Environment Variables
```bash
heroku config:set NEWS_API_KEY=your_key_here
heroku config:set GUARDIAN_API_KEY=your_key_here
heroku config:set SECRET_KEY=your_secret_key_here
heroku config:set DEBUG=False
heroku config:set DISABLE_COLLECTSTATIC=1
```

### Step 6: Create Procfile
Already created (see below)

### Step 7: Deploy
```bash
git push heroku main
```

### Step 8: Run Migrations
```bash
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Step 9: Access Your Site
```bash
heroku open
```

---

## 🎯 Option 3: Railway Deployment

### Step 1: Create Account
1. Go to https://railway.app/
2. Sign up with GitHub

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

### Step 3: Add Environment Variables
In Railway dashboard, add:
- `NEWS_API_KEY`
- `GUARDIAN_API_KEY`
- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS=*.railway.app`

### Step 4: Add PostgreSQL (Optional)
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will auto-configure DATABASE_URL

### Step 5: Deploy
Railway will automatically deploy on push to main branch

---

## 🎯 Option 4: VPS Deployment (DigitalOcean/AWS)

### Prerequisites
- Ubuntu 22.04 server
- Root or sudo access
- Domain name (optional)

### Step 1: Update Server
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Dependencies
```bash
sudo apt install python3-pip python3-venv nginx postgresql postgresql-contrib -y
```

### Step 3: Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/stevedav131207-cell/News-Aggregator-with-Category-Filters-Read-Later.git samachar
cd samachar
```

### Step 4: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### Step 5: Configure Environment
```bash
sudo nano .env
# Add your configuration
```

### Step 6: Setup PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE samachar_db;
CREATE USER samachar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE samachar_db TO samachar_user;
\q
```

### Step 7: Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

### Step 8: Configure Gunicorn
```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Add:
```ini
[Unit]
Description=gunicorn daemon for samachar
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/samachar
ExecStart=/var/www/samachar/venv/bin/gunicorn --workers 3 --bind unix:/var/www/samachar/samachar.sock samachar.wsgi:application

[Install]
WantedBy=multi-user.target
```

### Step 9: Start Gunicorn
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

### Step 10: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/samachar
```

Add:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /var/www/samachar;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/samachar/samachar.sock;
    }
}
```

### Step 11: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/samachar /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### Step 12: Setup SSL (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your_domain.com
```

---

## 📝 Required Files for Deployment

### 1. Procfile (for Heroku/Railway)
```
web: gunicorn samachar.wsgi --log-file -
```

### 2. runtime.txt (for Heroku)
```
python-3.13.0
```

### 3. requirements.txt (already exists)
Make sure it includes:
```
gunicorn
whitenoise
psycopg2-binary
dj-database-url
```

---

## ⚙️ Production Settings

### Update settings.py for Production

Add to `samachar/settings.py`:

```python
import os
import dj_database_url

# Production settings
if not DEBUG:
    # Security
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # WhiteNoise for static files
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    
    # Database (for Heroku/Railway)
    DATABASES['default'] = dj_database_url.config(conn_max_age=600)
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS if needed
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Review API rate limits

---

## 🧪 Testing Deployment

### Local Production Test
```bash
# Set production environment
export DEBUG=False
export SECRET_KEY=your_secret_key

# Collect static files
python manage.py collectstatic --noinput

# Test with Gunicorn
gunicorn samachar.wsgi:application
```

### Check Deployment
1. Visit your live URL
2. Test user registration
3. Test login
4. Test news fetching
5. Test bookmarks
6. Test search
7. Test admin panel

---

## 📊 Monitoring

### Setup Monitoring Tools
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **Uptime Robot** - Uptime monitoring
- **Google Analytics** - User analytics

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "samachar-news-app"
          heroku_email: "your-email@example.com"
```

---

## 📞 Support

### Common Issues

**Static files not loading:**
```bash
python manage.py collectstatic --noinput
```

**Database errors:**
```bash
python manage.py migrate
```

**Permission errors:**
```bash
sudo chown -R www-data:www-data /var/www/samachar
```

---

## 🎉 Next Steps

After deployment:
1. Test all features
2. Set up monitoring
3. Configure backups
4. Set up custom domain
5. Enable SSL
6. Configure CDN (optional)
7. Set up email (optional)

---

**Your SAMACHAR app is ready for production! 🚀**

Choose the deployment option that best fits your needs and follow the steps above.
