# SAMACHAR Quick Start Guide

Get up and running with SAMACHAR in 5 minutes!

## Prerequisites

- Python 3.13+ installed
- NewsAPI.org API key ([Get one free here](https://newsapi.org/register))

## Installation Steps

### 1. Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Configure Environment

Edit the `.env` file and add your API key:

```bash
NEWS_API_KEY=456550deb53f4bcebfc882cb397bb4c6

### 3. Set Up Database

```bash
python3 manage.py migrate
```

### 4. Create Admin User (Optional)

```bash
python3 manage.py createsuperuser
```

### 5. Start Server

```bash
python3 manage.py runserver
```

### 6. Access Application

Open your browser and go to:
- **Main App**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## First Steps

1. **Register**: Click "Register" and create an account
2. **Login**: Use your credentials to log in
3. **Browse**: View latest news from India (default)
4. **Filter**: Click category pills to filter news
5. **Search**: Use the search bar to find specific topics
6. **Bookmark**: Click the bookmark icon to save articles
7. **Manage**: Click "Bookmarks" to view and manage saved articles

## Quick Commands

```bash
# Run development server
python3 manage.py runserver

# Create migrations
python3 manage.py makemigrations

# Apply migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Check for issues
python3 manage.py check

# Collect static files (production)
python3 manage.py collectstatic
```

## Using the Quick Start Script

For an automated setup:

```bash
chmod +x start.sh
./start.sh
```

This script will:
- Create virtual environment
- Install dependencies
- Run migrations
- Offer to create superuser
- Start the development server

## Troubleshooting

### "No module named 'dotenv'"
```bash
pip3 install python-dotenv
```

### "NewsAPI error"
- Check your API key in `.env`
- Verify you haven't exceeded the daily limit (100 requests)

### "Database is locked"
- Close any other processes using the database
- Delete `db.sqlite3` and run migrations again

### Static files not loading
```bash
python3 manage.py collectstatic
```

## Project Structure

```
samachar/
├── accounts/          # User authentication
├── news/             # News fetching & display
├── bookmarks/        # Bookmark management
├── templates/        # HTML templates
├── static/           # CSS, JS, images
├── samachar/         # Project settings
└── manage.py         # Django CLI
```

## Key Features

✅ User authentication
✅ News aggregation from NewsAPI.org
✅ 7 category filters
✅ Keyword search
✅ Bookmark system with notes
✅ Offline support
✅ Responsive design
✅ Red/white theme

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [FEATURES.md](FEATURES.md) for complete feature list
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the full README
3. Check Django documentation
4. Verify NewsAPI.org status

## Development Tips

- Use `DEBUG=True` for development (already set)
- Check `samachar.log` for application logs
- Use Django admin panel for data management
- Test offline mode by disconnecting internet

Enjoy using SAMACHAR! 🗞️
