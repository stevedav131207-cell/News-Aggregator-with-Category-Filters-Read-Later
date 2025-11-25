#!/usr/bin/env python3
"""
Quick API Test - Verify NewsAPI is fetching data
"""

import requests

# Your API key from .env
API_KEY = "456550deb53f4bcebfc882cb397bb4c6"
BASE_URL = "https://newsapi.org/v2"

print("=" * 60)
print("  TESTING NEWSAPI CONNECTION")
print("=" * 60)

# Test 1: Get top headlines from India
print("\n1. Testing Top Headlines from India...")
print("-" * 60)

url = f"{BASE_URL}/top-headlines"
params = {
    'apiKey': API_KEY,
    'country': 'in',
    'language': 'en',
    'pageSize': 5
}

try:
    response = requests.get(url, params=params, timeout=10)
    data = response.json()
    
    if data.get('status') == 'ok':
        articles = data.get('articles', [])
        print(f"✅ SUCCESS! Fetched {len(articles)} articles")
        print()
        
        if articles:
            print("First 3 articles:")
            for i, article in enumerate(articles[:3], 1):
                print(f"\n{i}. {article.get('title', 'No title')}")
                print(f"   Source: {article.get('source', {}).get('name', 'Unknown')}")
                print(f"   URL: {article.get('url', 'No URL')[:60]}...")
    else:
        print(f"❌ ERROR: {data.get('message', 'Unknown error')}")
        print(f"   Status: {data.get('status')}")
        print(f"   Code: {data.get('code', 'N/A')}")
        
except Exception as e:
    print(f"❌ REQUEST FAILED: {e}")

# Test 2: Search for technology news
print("\n\n2. Testing Search (keyword: technology)...")
print("-" * 60)

url = f"{BASE_URL}/everything"
params = {
    'apiKey': API_KEY,
    'q': 'technology',
    'language': 'en',
    'pageSize': 3,
    'sortBy': 'publishedAt'
}

try:
    response = requests.get(url, params=params, timeout=10)
    data = response.json()
    
    if data.get('status') == 'ok':
        articles = data.get('articles', [])
        print(f"✅ SUCCESS! Found {len(articles)} articles")
        print()
        
        if articles:
            print("Search results:")
            for i, article in enumerate(articles, 1):
                print(f"\n{i}. {article.get('title', 'No title')}")
                print(f"   Source: {article.get('source', {}).get('name', 'Unknown')}")
    else:
        print(f"❌ ERROR: {data.get('message', 'Unknown error')}")
        
except Exception as e:
    print(f"❌ REQUEST FAILED: {e}")

print("\n" + "=" * 60)
print("  TEST COMPLETE")
print("=" * 60)
print("\nIf you see ✅ SUCCESS above, the API is working!")
print("You can now run: python3 manage.py runserver")
print("=" * 60 + "\n")
