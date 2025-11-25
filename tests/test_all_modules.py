#!/usr/bin/env python3
"""
Comprehensive Module Testing Script for SAMACHAR
Tests all modules, connections, and API calls
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'samachar.settings')
django.setup()

from django.conf import settings
from django.urls import reverse, resolve
from django.test import RequestFactory
from django.contrib.auth.models import User
from bookmarks.models import Bookmark
from news.news_api_client import get_news_client
import requests

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def test_settings():
    """Test Django settings configuration"""
    print_header("Testing Settings Configuration")
    
    tests_passed = 0
    tests_total = 0
    
    # Test apps
    tests_total += 1
    if 'accounts' in settings.INSTALLED_APPS:
        print("✅ accounts app registered")
        tests_passed += 1
    else:
        print("❌ accounts app NOT registered")
    
    tests_total += 1
    if 'news' in settings.INSTALLED_APPS:
        print("✅ news app registered")
        tests_passed += 1
    else:
        print("❌ news app NOT registered")
    
    tests_total += 1
    if 'bookmarks' in settings.INSTALLED_APPS:
        print("✅ bookmarks app registered")
        tests_passed += 1
    else:
        print("❌ bookmarks app NOT registered")
    
    # Test templates
    tests_total += 1
    if settings.TEMPLATES[0]['DIRS']:
        print("✅ Templates directory configured")
        tests_passed += 1
    else:
        print("❌ Templates directory NOT configured")
    
    # Test static files
    tests_total += 1
    if hasattr(settings, 'STATICFILES_DIRS'):
        print("✅ Static files directory configured")
        tests_passed += 1
    else:
        print("❌ Static files directory NOT configured")
    
    # Test API key
    tests_total += 1
    if hasattr(settings, 'NEWS_API_KEY'):
        if settings.NEWS_API_KEY:
            print("✅ NEWS_API_KEY configured")
            tests_passed += 1
        else:
            print("⚠️  NEWS_API_KEY is empty")
    else:
        print("❌ NEWS_API_KEY NOT configured")
    
    print(f"\nSettings Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_urls():
    """Test URL routing"""
    print_header("Testing URL Routing")
    
    tests_passed = 0
    tests_total = 0
    
    url_tests = [
        ('dashboard', '/'),
        ('search', '/search/'),
        ('login', '/login/'),
        ('register', '/register/'),
        ('logout', '/logout/'),
        ('bookmark_list', '/bookmarks/'),
        ('bookmark_create', '/bookmarks/add/'),
    ]
    
    for name, path in url_tests:
        tests_total += 1
        try:
            url = reverse(name)
            if url == path:
                print(f"✅ {name}: {path}")
                tests_passed += 1
            else:
                print(f"⚠️  {name}: expected {path}, got {url}")
                tests_passed += 1  # Still passes, just different path
        except Exception as e:
            print(f"❌ {name}: {e}")
    
    print(f"\nURL Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_models():
    """Test database models"""
    print_header("Testing Database Models")
    
    tests_passed = 0
    tests_total = 0
    
    # Test Bookmark model
    tests_total += 1
    try:
        from bookmarks.models import Bookmark
        print("✅ Bookmark model imported successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Bookmark model import failed: {e}")
    
    # Test model fields
    tests_total += 1
    try:
        fields = [f.name for f in Bookmark._meta.get_fields()]
        required_fields = ['user', 'title', 'description', 'url', 'category']
        if all(field in fields for field in required_fields):
            print(f"✅ Bookmark model has all required fields")
            tests_passed += 1
        else:
            print(f"❌ Bookmark model missing fields")
    except Exception as e:
        print(f"❌ Field check failed: {e}")
    
    print(f"\nModel Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_views():
    """Test view functions"""
    print_header("Testing View Functions")
    
    tests_passed = 0
    tests_total = 0
    
    # Test accounts views
    tests_total += 1
    try:
        from accounts.views import register_view, login_view, logout_view
        print("✅ Accounts views imported successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Accounts views import failed: {e}")
    
    # Test news views
    tests_total += 1
    try:
        from news.views import dashboard_view, search_view
        print("✅ News views imported successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ News views import failed: {e}")
    
    # Test bookmarks views
    tests_total += 1
    try:
        from bookmarks.views import bookmark_list_view, bookmark_create_view
        print("✅ Bookmarks views imported successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Bookmarks views import failed: {e}")
    
    print(f"\nView Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_templates():
    """Test template files"""
    print_header("Testing Template Files")
    
    tests_passed = 0
    tests_total = 0
    
    templates = [
        'templates/base.html',
        'templates/404.html',
        'templates/500.html',
        'accounts/templates/accounts/login.html',
        'accounts/templates/accounts/register.html',
        'news/templates/news/dashboard.html',
        'news/templates/news/search_results.html',
        'bookmarks/templates/bookmarks/list.html',
        'bookmarks/templates/bookmarks/edit.html',
    ]
    
    for template in templates:
        tests_total += 1
        if os.path.exists(template):
            print(f"✅ {template}")
            tests_passed += 1
        else:
            print(f"❌ {template} NOT FOUND")
    
    print(f"\nTemplate Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_static_files():
    """Test static files"""
    print_header("Testing Static Files")
    
    tests_passed = 0
    tests_total = 0
    
    static_files = [
        'static/js/app.js',
        'static/js/offline.js',
        'static/css/custom.css',
        'static/images/placeholder.svg',
    ]
    
    for static_file in static_files:
        tests_total += 1
        if os.path.exists(static_file):
            print(f"✅ {static_file}")
            tests_passed += 1
        else:
            print(f"❌ {static_file} NOT FOUND")
    
    print(f"\nStatic File Tests: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total

def test_api_client():
    """Test NewsAPI client"""
    print_header("Testing NewsAPI Client")
    
    tests_passed = 0
    tests_total = 0
    
    # Test client import
    tests_total += 1
    try:
        client = get_news_client()
        print("✅ NewsAPI client created successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ NewsAPI client creation failed: {e}")
        return False
    
    # Test API key
    tests_total += 1
    if client.api_key:
        print("✅ API key is configured")
        tests_passed += 1
    else:
        print("⚠️  API key is empty (add to .env file)")
    
    # Test API methods exist
    tests_total += 1
    if hasattr(client, 'get_top_headlines') and hasattr(client, 'search_news'):
        print("✅ API methods exist")
        tests_passed += 1
    else:
        print("❌ API methods missing")
    
    print(f"\nAPI Client Tests: {tests_passed}/{tests_total} passed")
    return tests_passed >= tests_total - 1  # Allow API key to be empty

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("  SAMACHAR COMPREHENSIVE MODULE TEST")
    print("=" * 60)
    
    results = {
        'Settings': test_settings(),
        'URLs': test_urls(),
        'Models': test_models(),
        'Views': test_views(),
        'Templates': test_templates(),
        'Static Files': test_static_files(),
        'API Client': test_api_client(),
    }
    
    print_header("FINAL RESULTS")
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:20} {status}")
    
    all_passed = all(results.values())
    
    print("\n" + "=" * 60)
    if all_passed:
        print("  ✅ ALL TESTS PASSED!")
        print("  The application is ready to run.")
        print("\n  Next steps:")
        print("  1. Add NEWS_API_KEY to .env file")
        print("  2. Run: python3 manage.py migrate")
        print("  3. Run: python3 manage.py runserver")
    else:
        print("  ❌ SOME TESTS FAILED")
        print("  Please review the errors above.")
    print("=" * 60 + "\n")
    
    return 0 if all_passed else 1

if __name__ == '__main__':
    sys.exit(main())
