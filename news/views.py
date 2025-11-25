from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .api_clients.aggregator import get_news_aggregator
import logging

logger = logging.getLogger(__name__)


@login_required
def dashboard_view(request):
    """Main dashboard view displaying news articles from multiple sources"""
    category = request.GET.get('category', 'india')
    aggregator = get_news_aggregator()
    
    # Fetch news based on category from all available APIs
    if category == 'india':
        # For India, use search to get better results
        response = aggregator.search_news('india', category=None, page_size=100)
    elif category == 'world':
        # For world news, fetch general news
        response = aggregator.get_top_headlines(category='world', country='', page_size=100)
    else:
        # For other categories, fetch by category
        response = aggregator.get_top_headlines(category=category, country='', page_size=100)
    
    articles = response.get('articles', [])
    error_message = None
    sources_used = response.get('sources_used', 0)
    
    if response.get('status') == 'error':
        error_message = 'Unable to fetch news at this time. Please try again later.'
        logger.error(f"News aggregator error: {response.get('message')}")
    
    # If no articles and it's India category, show helpful message
    if not articles and category == 'india':
        error_message = 'No India news available at the moment. NewsAPI daily limit may have been reached. Try other categories or wait for the limit to reset.'
    
    context = {
        'articles': articles,
        'category': category,
        'error_message': error_message,
        'sources_used': sources_used,
    }
    
    # Disable caching to ensure fresh news on every reload
    response = render(request, 'news/dashboard.html', context)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
    return response


@login_required
def search_view(request):
    """Search view for finding news by keyword with optional category filter across multiple sources"""
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    articles = []
    error_message = None
    sources_used = 0
    
    if query:
        aggregator = get_news_aggregator()
        response = aggregator.search_news(query, category=category if category else None, page_size=100)
        articles = response.get('articles', [])
        sources_used = response.get('sources_used', 0)
        
        if response.get('status') == 'error':
            error_message = 'Unable to search news at this time. Please try again later.'
            logger.error(f"News aggregator search error: {response.get('message')}")
    
    context = {
        'articles': articles,
        'query': query,
        'category': category,
        'error_message': error_message,
        'sources_used': sources_used,
    }
    
    # Disable caching to ensure fresh search results
    response = render(request, 'news/search_results.html', context)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
    return response
