# SAMACHAR Deployment Guide

## Production Checklist

Before deploying to production, make sure to complete these steps:

### 1. Environment Variables

Create a `.env` file with production values:

```bash
# Django Settings
SECRET_KEY=your-long-random-secret-key-here-at-least-50-characters
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# NewsAPI
NEWS_API_KEY=your_newsapi_key_here

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### 2. Security Settings

In `samachar/settings.py`, uncomment these lines:

```python
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### 3. Static Files

Collect static files for production:

```bash
python manage.py collectstatic
```

### 4. Database

Run migrations:

```bash
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

### 5. Web Server

#### Using Gunicorn

Install Gunicorn:

```bash
pip install gunicorn
```

Run with:

```bash
gunicorn samachar.wsgi:application --bind 0.0.0.0:8000
```

#### Using uWSGI

Install uWSGI:

```bash
pip install uwsgi
```

Create `uwsgi.ini`:

```ini
[uwsgi]
module = samachar.wsgi:application
master = true
processes = 4
socket = /tmp/samachar.sock
chmod-socket = 666
vacuum = true
```

### 6. Nginx Configuration

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /static/ {
        alias /path/to/samachar/staticfiles/;
    }

    location /media/ {
        alias /path/to/samachar/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. SSL Certificate

Use Let's Encrypt for free SSL:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 8. Monitoring

Set up logging and monitoring:

- Check `samachar.log` for application logs
- Set up error tracking (e.g., Sentry)
- Monitor server resources

### 9. Backup

Set up regular backups:

```bash
# Backup database
python manage.py dumpdata > backup.json

# Backup media files
tar -czf media_backup.tar.gz media/
```

### 10. Performance

- Enable caching (Redis/Memcached)
- Use CDN for static files
- Optimize database queries
- Set up database connection pooling

## Environment-Specific Settings

### Development

```python
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
```

### Production

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
```

## Troubleshooting

### Static files not loading

```bash
python manage.py collectstatic --clear
```

### Database connection errors

Check your `DATABASE_URL` in `.env`

### 502 Bad Gateway

Check if Gunicorn/uWSGI is running:

```bash
ps aux | grep gunicorn
```

### CSRF verification failed

Make sure `CSRF_TRUSTED_ORIGINS` includes your domain:

```python
CSRF_TRUSTED_ORIGINS = ['https://yourdomain.com']
```

## Scaling

For high traffic:

1. Use a load balancer
2. Set up multiple application servers
3. Use a separate database server
4. Implement caching strategy
5. Use a CDN for static files

## Security Best Practices

1. Keep Django and dependencies updated
2. Use strong SECRET_KEY
3. Enable HTTPS only
4. Set up rate limiting
5. Regular security audits
6. Monitor for suspicious activity
7. Keep API keys secure
8. Regular backups
