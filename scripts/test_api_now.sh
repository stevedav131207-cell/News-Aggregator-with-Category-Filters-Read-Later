#!/bin/bash

echo "=========================================="
echo "  TESTING NEWSAPI CONNECTION"
echo "=========================================="
echo ""

# Test 1: Check .env file
echo "1. Checking .env file..."
if [ -f .env ]; then
    if grep -q "NEWS_API_KEY=456550deb53f4bcebfc882cb397bb4c6" .env; then
        echo "   ✅ API key found in .env"
    else
        echo "   ⚠️  API key format might be wrong"
        echo "   Current .env content:"
        cat .env
    fi
else
    echo "   ❌ .env file not found!"
fi

echo ""

# Test 2: Check if python-dotenv is installed
echo "2. Checking dependencies..."
python3 -c "import dotenv" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ python-dotenv installed"
else
    echo "   ❌ python-dotenv not installed"
    echo "   Run: pip3 install python-dotenv"
fi

python3 -c "import requests" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ requests installed"
else
    echo "   ❌ requests not installed"
    echo "   Run: pip3 install requests"
fi

echo ""

# Test 3: Test API directly
echo "3. Testing API connection..."
echo "   Making request to NewsAPI.org..."
python3 quick_api_test.py

echo ""
echo "=========================================="
echo "  NEXT STEPS"
echo "=========================================="
echo ""
echo "If you saw ✅ SUCCESS above:"
echo "  1. Run: python3 manage.py migrate"
echo "  2. Run: python3 manage.py runserver"
echo "  3. Visit: http://127.0.0.1:8000/"
echo ""
echo "If you saw ❌ ERROR:"
echo "  1. Check SETUP_API_CONNECTION.md"
echo "  2. Verify your API key at newsapi.org"
echo "  3. Check internet connection"
echo ""
echo "=========================================="
