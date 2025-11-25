#!/usr/bin/env python3
"""Test bookmark functionality"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'samachar.settings')
django.setup()

from django.contrib.auth.models import User
from bookmarks.models import Bookmark
from datetime import datetime

print("Testing Bookmark Functionality")
print("=" * 50)

# Check if test user exists
try:
    user = User.objects.first()
    if not user:
        print("❌ No users found. Please create a user first.")
        exit(1)
    
    print(f"✓ Found user: {user.username}")
    
    # Test creating a bookmark
    test_bookmark = Bookmark.objects.create(
        user=user,
        title="Test Article",
        description="This is a test article",
        url="https://example.com/test",
        image_url="https://example.com/image.jpg",
        source="Test Source",
        category="technology",
        published_at=datetime.now()
    )
    
    print(f"✓ Created test bookmark: {test_bookmark.title}")
    
    # Test retrieving bookmarks
    bookmarks = Bookmark.objects.filter(user=user)
    print(f"✓ User has {bookmarks.count()} bookmark(s)")
    
    # Clean up test bookmark
    test_bookmark.delete()
    print("✓ Cleaned up test bookmark")
    
    print("\n" + "=" * 50)
    print("✅ All bookmark tests passed!")
    print("\nBookmark functionality is working correctly.")
    print("If bookmarks still don't work in the browser:")
    print("1. Check browser console for JavaScript errors")
    print("2. Verify you're logged in")
    print("3. Clear browser cache and cookies")
    print("4. Restart the Django server")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
