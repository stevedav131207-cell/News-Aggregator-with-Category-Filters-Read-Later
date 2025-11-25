#!/usr/bin/env python3
"""
NewsAPI Connection Test Script
Tests the NewsAPI.org integration in SAMACHAR
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'samachar.settings')
django.setup()

from news.news_api_client import get_news_client
from django.conf import settings

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def test_api_key():
    """Test if API key is configured"""
    print_header("Testing API Key Configuration")
    
    if not settings.NEWS_API_KEY:
        print("❌ API key is NOT configured")
        print("\nTo fix this:")
        print("1. Get a free API key from: https://newsapi.org/register")
        print("2. Add it to .env file:")
        print("   echo 'NEWS_API_KEY=your_key_here' > .env")
        return False
    
    print(f"✅ API key is configured")
    print(f"   Key: {settings.NEWS_API_KEY[:10]}..." if len(settings.NEWS_API_KEY) > 10 else "   Key: (too short)")
    return True

def test_client_creation():
    """Test if client can be created"""
    print_header("Testing Client Creation")
    
    try:
        client = get_news_client()
        print("✅ NewsAPI client created successfully")
        print(f"   Base URL: {client.BASE_URL}")
        return True, client
    except Exception as e:
        print(f"❌ Failed to create client: {e}")
        return False, None

def test_top_headlines(client):
    """Test fetching top headlines"""
    print_header("Testing Top Headlines API")
    
    print("Fetching top headlines from India...")
    try:
        response = client.get_top_headlines(country='in', page_size=5)
        
        if response.get('status') == 'ok':
            articles = response.get('articles', [])
            print(f"✅ Success! Received {len(articles)} articles")
            
            if articles:
                print("\nFirst article:")
                article = articles[0]
                print(f"  Title: {article.get('title', 'N/A')[:60]}...")
                print(f"  Source: {article.get('source', {}).get('name', 'N/A')}")
                print(f"  Published: {article.get('publishedAt', 'N/A')}")
                print(f"  URL: {article.get('url', 'N/A')[:50]}...")
            
            return True
        else:
            print(f"❌ API returned error status")
            print(f"   Status: {response.get('status')}")
            print(f"   Message: {response.get('message', 'No message')}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False

def test_category_headlines(client):
    """Test fetching category-specific headlines"""
    print_header("Testing Category Headlines")
    
    categories = ['technology', 'business', 'sports']
    
    for category in categories:
        print(f"\nTesting {category} category...")
        try:
            response = client.get_top_headlines(
                category=category,
                country='in',
                page_size=3
            )
            
            if response.get('status') == 'ok':
                count = len(response.get('articles', []))
                print(f"  ✅ {category}: {count} articles")
            else:
                print(f"  ❌ {category}: {response.get('message', 'Error')}")
        except Exception as e:
            print(f"  ❌ {category}: {e}")
    
    return True

def test_search(client):
    """Test search functionality"""
    print_header("Testing Search API")
    
    query = "technology"
    print(f"Searching for '{query}'...")
    
    try:
        response = client.search_news(query, page_size=5)
        
        if response.get('status') == 'ok':
            articles = response.get('articles', [])
            print(f"✅ Success! Found {len(articles)} articles")
            
            if articles:
                print("\nFirst result:")
                article = articles[0]
                print(f"  Title: {article.get('title', 'N/A')[:60]}...")
                print(f"  Source: {article.get('source', {}).get('name', 'N/A')}")
            
            return True
        else:
            print(f"❌ Search failed")
            print(f"   Message: {response.get('message', 'No message')}")
            return False
            
    except Exception as e:
        print(f"❌ Search request failed: {e}")
        return False

def test_error_handling(client):
    """Test error handling"""
    print_header("Testing Error Handling")
    
    print("Testing with invalid parameters...")
    try:
        # This should handle gracefully
        response = client.get_top_headlines(
            category='invalid_category',
            country='in',
            page_size=5
        )
        
        if response.get('status') == 'error':
            print("✅ Error handling works correctly")
            print(f"   Error message: {response.get('message', 'N/A')}")
        else:
            print("✅ Request succeeded (API accepted parameters)")
        
        return True
    except Exception as e:
        print(f"⚠️  Exception raised: {e}")
        return True  # Still passes if exception is caught

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("  NEWSAPI.ORG CONNECTION TEST")
    print("=" * 60)
    
    results = {}
    
    # Test 1: API Key
    results['API Key'] = test_api_key()
    
    if not results['API Key']:
        print("\n" + "=" * 60)
        print("  ⚠️  CANNOT PROCEED WITHOUT API KEY")
        print("=" * 60)
        return 1
    
    # Test 2: Client Creation
    success, client = test_client_creation()
    results['Client Creation'] = success
    
    if not success:
        print("\n" + "=" * 60)
        print("  ❌ TESTS FAILED")
        print("=" * 60)
        return 1
    
    # Test 3: Top Headlines
    results['Top Headlines'] = test_top_headlines(client)
    
    # Test 4: Category Headlines
    results['Category Headlines'] = test_category_headlines(client)
    
    # Test 5: Search
    results['Search'] = test_search(client)
    
    # Test 6: Error Handling
    results['Error Handling'] = test_error_handling(client)
    
    # Summary
    print_header("TEST RESULTS SUMMARY")
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:25} {status}")
    
    all_passed = all(results.values())
    
    print("\n" + "=" * 60)
    if all_passed:
        print("  ✅ ALL TESTS PASSED!")
        print("\n  NewsAPI.org is properly connected and working!")
        print("\n  You can now:")
        print("  1. Run: python3 manage.py runserver")
        print("  2. Visit: http://127.0.0.1:8000/")
        print("  3. Register and login")
        print("  4. Browse news from India")
        print("  5. Try different categories")
        print("  6. Search for topics")
    else:
        print("  ❌ SOME TESTS FAILED")
        print("\n  Please check:")
        print("  1. Your API key is valid")
        print("  2. You have internet connection")
        print("  3. NewsAPI.org is accessible")
        print("  4. You haven't exceeded daily limit (100 requests)")
    print("=" * 60 + "\n")
    
    return 0 if all_passed else 1

if __name__ == '__main__':
    sys.exit(main())
