#!/usr/bin/env python3
"""Test all configured news APIs"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'samachar.settings')
django.setup()

from django.conf import settings
from news.api_clients.newsapi_client import NewsAPIClient
from news.api_clients.guardian_client import GuardianClient
from news.api_clients.nyt_client import NYTimesClient
from news.api_clients.currents_client import CurrentsClient
from news.api_clients.gnews_client import GNewsClient
from news.api_clients.mediastack_client import MediaStackClient
from news.api_clients.newsdata_client import NewsDataClient

print("=" * 70)
print("TESTING ALL NEWS APIs")
print("=" * 70)

# API configurations
apis = [
    ('NewsAPI', settings.NEWS_API_KEY, NewsAPIClient),
    ('Guardian', settings.GUARDIAN_API_KEY, GuardianClient),
    ('NYT', settings.NYT_API_KEY, NYTimesClient),
    ('Currents', settings.CURRENTS_API_KEY, CurrentsClient),
    ('GNews', settings.GNEWS_API_KEY, GNewsClient),
    ('MediaStack', settings.MEDIASTACK_API_KEY, MediaStackClient),
    ('NewsData', settings.NEWSDATA_API_KEY, NewsDataClient),
]

results = []

for api_name, api_key, ClientClass in apis:
    print(f"\n{'='*70}")
    print(f"Testing: {api_name}")
    print(f"{'='*70}")
    
    # Check if API key is configured
    if not api_key or api_key.endswith('...'):
        print(f"❌ API key not configured (placeholder or empty)")
        print(f"   Key: {api_key[:20] if api_key else 'NOT SET'}...")
        results.append((api_name, 'NOT_CONFIGURED', 0))
        continue
    
    print(f"✓ API key found: {api_key[:20]}...")
    
    try:
        # Initialize client
        client = ClientClass(api_key)
        print(f"✓ Client initialized")
        
        # Test get_top_headlines
        print(f"\nTesting get_top_headlines()...")
        response = client.get_top_headlines(category='business', page_size=5)
        
        if response.get('status') == 'ok' or 'articles' in response:
            articles = response.get('articles', [])
            print(f"✓ Status: OK")
            print(f"✓ Articles returned: {len(articles)}")
            
            if articles:
                print(f"✓ First article: {articles[0].get('title', 'No title')[:60]}...")
                results.append((api_name, 'WORKING', len(articles)))
            else:
                print(f"⚠ No articles returned (might be API limitation)")
                results.append((api_name, 'NO_RESULTS', 0))
        else:
            error_msg = response.get('message', 'Unknown error')
            print(f"❌ Error: {error_msg}")
            results.append((api_name, 'ERROR', 0))
            
    except Exception as e:
        print(f"❌ Exception: {str(e)[:100]}")
        results.append((api_name, 'EXCEPTION', 0))

# Summary
print(f"\n{'='*70}")
print("SUMMARY")
print(f"{'='*70}\n")

working = []
not_working = []
not_configured = []

for api_name, status, count in results:
    if status == 'WORKING':
        working.append(f"✅ {api_name}: {count} articles")
    elif status == 'NOT_CONFIGURED':
        not_configured.append(f"⚠️  {api_name}: Not configured")
    else:
        not_working.append(f"❌ {api_name}: {status}")

print("Working APIs:")
if working:
    for item in working:
        print(f"  {item}")
else:
    print("  None")

print("\nNot Configured:")
if not_configured:
    for item in not_configured:
        print(f"  {item}")
else:
    print("  None")

print("\nNot Working:")
if not_working:
    for item in not_working:
        print(f"  {item}")
else:
    print("  None")

print(f"\n{'='*70}")
print(f"Total APIs: {len(results)}")
print(f"Working: {len(working)}")
print(f"Not Configured: {len(not_configured)}")
print(f"Not Working: {len(not_working)}")
print(f"{'='*70}\n")

# Recommendations
if not_configured:
    print("💡 To configure missing APIs:")
    print("   1. Get API keys from:")
    for api_name, status, _ in results:
        if status == 'NOT_CONFIGURED':
            if api_name == 'NYT':
                print(f"      - {api_name}: https://developer.nytimes.com/get-started")
            elif api_name == 'Currents':
                print(f"      - {api_name}: https://currentsapi.services/en/register")
    print("   2. Add keys to .env file")
    print("   3. Restart Django server")
    print("   4. Run this test again")
    print()

if working:
    print(f"✅ {len(working)} API(s) working! Your news aggregator is ready!")
    print(f"   Go to http://127.0.0.1:8000/ to see news from multiple sources")
else:
    print("⚠️  No APIs are working. Please check your API keys.")

print()
