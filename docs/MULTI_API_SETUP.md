# Multi-API Setup Guide

## Overview

SAMACHAR now supports **7 different news APIs** that work together to provide comprehensive news coverage from thousands of sources worldwide. The system automatically aggregates, deduplicates, and sorts articles from all configured APIs.

## Benefits of Multi-API Integration

✅ **Increased Coverage**: Access to 10,000+ news sources globally
✅ **Higher Request Limits**: Combined daily limits of 14,400+ requests
✅ **Redundancy**: If one API fails, others continue working
✅ **Diverse Sources**: Mix of mainstream, regional, and specialized news
✅ **Better Results**: More articles, better search results
✅ **Automatic Deduplication**: No duplicate articles shown

## Supported APIs

### 1. NewsAPI.org
- **Free Tier**: 100 requests/day
- **Sources**: 80,000+ articles from 150+ sources
- **Best For**: General news, breaking news
- **Sign Up**: https://newsapi.org/register

### 2. The Guardian
- **Free Tier**: 12,000 requests/day (highest!)
- **Sources**: The Guardian newspaper
- **Best For**: Quality journalism, UK/World news
- **Sign Up**: https://open-platform.theguardian.com/access/

### 3. New York Times
- **Free Tier**: 1,000 requests/day
- **Sources**: NYT articles and archives
- **Best For**: US news, in-depth reporting
- **Sign Up**: https://developer.nytimes.com/get-started

### 4. Currents API
- **Free Tier**: 600 requests/day
- **Sources**: 40,000+ sources worldwide
- **Best For**: NewsAPI alternative, diverse sources
- **Sign Up**: https://currentsapi.services/en/register

### 5. GNews
- **Free Tier**: 100 requests/day
- **Sources**: Google News aggregation
- **Best For**: Multi-language, global coverage
- **Sign Up**: https://gnews.io/

### 6. MediaStack
- **Free Tier**: 500 requests/month
- **Sources**: 7,500+ sources
- **Best For**: Real-time news, media monitoring
- **Sign Up**: https://mediastack.com/product

### 7. NewsData.io
- **Free Tier**: 200 requests/day
- **Sources**: Multiple aggregated sources
- **Best For**: Diverse content, good free tier
- **Sign Up**: https://newsdata.io/register

## Quick Setup (Minimum)

You only need **ONE** API key to get started. The system works with any combination of APIs.

### Option 1: Keep Current Setup (NewsAPI only)
```bash
# Your .env file
NEWS_API_KEY=your_existing_key
```
✅ Already working! No changes needed.

### Option 2: Add Guardian (Recommended - Best Free Tier)
```bash
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key  # 12,000 requests/day!
```

### Option 3: Maximum Coverage (All APIs)
```bash
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
NYT_API_KEY=your_nyt_key
CURRENTS_API_KEY=your_currents_key
GNEWS_API_KEY=your_gnews_key
MEDIASTACK_API_KEY=your_mediastack_key
NEWSDATA_API_KEY=your_newsdata_key
```

## Step-by-Step Setup

### 1. Get API Keys

Visit each API website and sign up for a free account:

**NewsAPI.org** (Already have this)
1. Visit https://newsapi.org/register
2. Fill in your details
3. Verify email
4. Copy API key from dashboard

**The Guardian** (Highly Recommended)
1. Visit https://open-platform.theguardian.com/access/
2. Click "Register for a developer key"
3. Fill in the form (use "Personal" for issue)
4. Check email for API key

**New York Times**
1. Visit https://developer.nytimes.com/get-started
2. Create account
3. Create an app
4. Enable "Top Stories API" and "Article Search API"
5. Copy API key

**Currents API**
1. Visit https://currentsapi.services/en/register
2. Sign up with email
3. Verify email
4. Copy API key from dashboard

**GNews**
1. Visit https://gnews.io/
2. Click "Get API Key"
3. Sign up
4. Copy API key

**MediaStack**
1. Visit https://mediastack.com/product
2. Click "Get Free API Key"
3. Sign up
4. Copy API key from dashboard

**NewsData.io**
1. Visit https://newsdata.io/register
2. Sign up
3. Verify email
4. Copy API key from dashboard

### 2. Add Keys to .env File

Edit your `.env` file and add the API keys:

```bash
# News API Configuration
NEWS_API_KEY=abc123...
GUARDIAN_API_KEY=def456...
NYT_API_KEY=ghi789...
CURRENTS_API_KEY=jkl012...
GNEWS_API_KEY=mno345...
MEDIASTACK_API_KEY=pqr678...
NEWSDATA_API_KEY=stu901...
```

**Note**: Leave any API key blank if you don't want to use that service.

### 3. Restart Server

```bash
python3 manage.py runserver
```

### 4. Verify Setup

Check the logs when you load the dashboard:

```
INFO news.api_clients.aggregator Initialized 7 news API clients
INFO news.api_clients.aggregator Aggregated 95 unique articles from 7 sources
```

You'll also see a badge showing how many API sources are active!

## How It Works

### Aggregation Process

```
User Request
    ↓
Aggregator fetches from ALL configured APIs in parallel
    ↓
Results combined (NewsAPI + Guardian + NYT + ...)
    ↓
Duplicates removed (same title = duplicate)
    ↓
Articles sorted by date (newest first)
    ↓
Top 100 articles returned
    ↓
Displayed to user
```

### Parallel Fetching

All APIs are called **simultaneously** using ThreadPoolExecutor:
- Faster response times
- No waiting for slow APIs
- Failed APIs don't block others

### Deduplication

Articles with the same title are considered duplicates:
- Only the first occurrence is kept
- Ensures unique content
- Reduces clutter

### Error Handling

- If an API fails, others continue working
- Errors are logged but don't affect user experience
- System gracefully degrades

## Request Limits

### Daily Limits (Free Tiers)

| API | Daily Limit | Monthly Equivalent |
|-----|-------------|-------------------|
| Guardian | 12,000 | 360,000 |
| NYT | 1,000 | 30,000 |
| Currents | 600 | 18,000 |
| NewsData | 200 | 6,000 |
| NewsAPI | 100 | 3,000 |
| GNews | 100 | 3,000 |
| MediaStack | ~17 | 500 |
| **TOTAL** | **14,017** | **420,500** |

### Optimization Tips

1. **Use Guardian as Primary**: Highest free tier limit
2. **Enable All APIs**: Spreads load across services
3. **Cache Results**: Implement caching for repeated requests
4. **Monitor Usage**: Check API dashboards regularly

## Troubleshooting

### "Initialized 0 news API clients"

**Problem**: No API keys configured
**Solution**: Add at least one API key to `.env` file

### "Initialized 1 news API clients" (Expected more)

**Problem**: Some API keys are invalid or empty
**Solution**: 
- Check for typos in `.env` file
- Verify API keys are active
- Check API key format (no quotes, no spaces)

### No Articles Returned

**Problem**: All APIs failed or returned no results
**Solution**:
- Check internet connection
- Verify API keys are valid
- Check API service status
- Review logs for specific errors

### Duplicate Articles Still Showing

**Problem**: Deduplication not working
**Solution**: Articles have slightly different titles - this is normal

### Slow Performance

**Problem**: Too many API calls
**Solution**:
- Reduce number of active APIs
- Implement caching
- Use pagination

## Best Practices

### For Development

```bash
# Minimum setup - just one API
NEWS_API_KEY=your_key
```

### For Testing

```bash
# Add Guardian for better coverage
NEWS_API_KEY=your_key
GUARDIAN_API_KEY=your_key
```

### For Production

```bash
# Enable all APIs for maximum coverage
NEWS_API_KEY=your_key
GUARDIAN_API_KEY=your_key
NYT_API_KEY=your_key
CURRENTS_API_KEY=your_key
GNEWS_API_KEY=your_key
MEDIASTACK_API_KEY=your_key
NEWSDATA_API_KEY=your_key
```

## Monitoring

### Check Active Sources

Look for the badge on the dashboard:
```
🟢 7 API Sources
```

### Check Logs

```bash
tail -f samachar.log
```

Look for:
```
INFO news.api_clients.aggregator NewsAPI: Fetched 100 articles
INFO news.api_clients.aggregator Guardian: Fetched 50 articles
INFO news.api_clients.aggregator NYT: Fetched 20 articles
...
INFO news.api_clients.aggregator Aggregated 150 unique articles from 7 sources
```

### Test Individual APIs

Create a test script:

```python
from news.api_clients.aggregator import get_news_aggregator

aggregator = get_news_aggregator()
print(f"Active clients: {len(aggregator.clients)}")

for name, client in aggregator.clients:
    print(f"✓ {name} initialized")
```

## Cost Comparison

All APIs listed have **FREE tiers** that are sufficient for most use cases.

### When to Upgrade

Consider paid plans if you need:
- More than 14,000 requests/day
- Historical data access
- Commercial use
- Premium sources
- Advanced features

### Paid Tier Costs (Optional)

- **NewsAPI**: $449/month (unlimited)
- **Guardian**: Free only (no paid tier)
- **NYT**: $10/month (4,000 requests/day)
- **Currents**: $10/month (10,000 requests/day)
- **GNews**: $9/month (10,000 requests/day)
- **MediaStack**: $9.99/month (10,000 requests/month)
- **NewsData**: $10/month (10,000 requests/day)

## FAQ

**Q: Do I need all 7 APIs?**
A: No! Start with just NewsAPI (already configured) or add Guardian for better coverage.

**Q: Which API is best?**
A: Guardian has the highest free tier (12,000/day) and excellent quality.

**Q: Can I use only free tiers?**
A: Yes! All APIs have generous free tiers.

**Q: Will this slow down my app?**
A: No! APIs are called in parallel, so it's actually faster.

**Q: What if an API key is invalid?**
A: The system will skip that API and use the others.

**Q: How do I know which APIs are working?**
A: Check the badge on the dashboard showing "X API Sources".

**Q: Can I add more APIs later?**
A: Yes! Just add the API key to `.env` and restart the server.

**Q: Do I need to modify code?**
A: No! Just add API keys to `.env` file.

## Support

For API-specific issues:
- Check the API's documentation
- Contact the API provider's support
- Check API status pages

For SAMACHAR issues:
- Check `samachar.log` for errors
- Verify `.env` configuration
- Ensure all dependencies are installed

---

**Ready to get started?** Add your first additional API key to `.env` and restart the server!
