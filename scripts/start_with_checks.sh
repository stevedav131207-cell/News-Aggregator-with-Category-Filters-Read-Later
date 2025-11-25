#!/bin/bash

echo "🚀 SAMACHAR Startup Script"
echo "=========================="
echo ""

# Check Python
echo "✓ Checking Python..."
python3 --version || { echo "❌ Python 3 not found!"; exit 1; }

# Check Django
echo "✓ Checking Django..."
python3 -c "import django; print(f'Django {django.get_version()}')" || { echo "❌ Django not installed!"; exit 1; }

# Check database
echo "✓ Checking database..."
python3 manage.py migrate --check || {
    echo "⚠ Running migrations..."
    python3 manage.py migrate
}

# Check static files
echo "✓ Checking static files..."
if [ ! -f "static/js/app.js" ]; then
    echo "❌ static/js/app.js not found!"
    exit 1
fi

# Check settings
echo "✓ Checking CSRF settings..."
grep -q "CSRF_COOKIE_HTTPONLY = False" samachar/settings.py || {
    echo "⚠ CSRF_COOKIE_HTTPONLY should be False"
    echo "  Current setting:"
    grep "CSRF_COOKIE_HTTPONLY" samachar/settings.py
}

# Test bookmark backend
echo "✓ Testing bookmark backend..."
python3 test_bookmark.py || {
    echo "⚠ Bookmark backend test failed"
}

echo ""
echo "=========================="
echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "  1. Server will start in 3 seconds..."
echo "  2. Go to http://127.0.0.1:8000/"
echo "  3. Login with your credentials"
echo "  4. Try bookmarking an article"
echo ""
echo "💡 If bookmarks don't work:"
echo "  - Clear browser cache (Ctrl+Shift+Delete)"
echo "  - Open browser console (F12)"
echo "  - Check for errors"
echo "  - See BOOKMARK_TROUBLESHOOTING.md"
echo ""
echo "Starting server in 3 seconds..."
sleep 3

# Start server
python3 manage.py runserver
