import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class NewsAPIClient:
    """Client for interacting with NewsAPI.org"""
    
    BASE_URL = 'https://newsapi.org/v2'
    
    def __init__(self):
        self.api_key = settings.NEWS_API_KEY
        if not self.api_key:
            logger.warning('456550deb53f4bcebfc882cb397bb4c6')
    
    def _make_request(self, endpoint, params):
        """Make a request to the NewsAPI"""
        params['apiKey'] = self.api_key
        
        try:
            response = requests.get(f'{self.BASE_URL}/{endpoint}', params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f'NewsAPI request failed: {e}')
            return {'status': 'error', 'articles': [], 'message': str(e)}
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """
        Fetch top headlines from NewsAPI
        
        Args:
            category: News category (business, entertainment, general, health, science, sports, technology)
            country: Country code (default: 'in' for India)
            page_size: Number of articles to fetch (max 100)
            language: Language code (default: 'en')
        
        Returns:
            dict: API response with articles
        """
        params = {
            'language': language,
            'pageSize': min(page_size, 100),
        }
        
        # NewsAPI uses 'general' for top stories, but we'll map 'india' to country filter
        if category and category.lower() != 'india':
            params['category'] = category.lower()
            params['country'] = country
        else:
            # For India or no category, just use country filter
            params['country'] = country
        
        return self._make_request('top-headlines', params)
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """
        Search for news articles by keyword with optional category filter
        
        Args:
            query: Search keyword
            category: Optional category filter (business, entertainment, general, health, science, sports, technology)
            page_size: Number of articles to fetch (max 100)
            language: Language code (default: 'en')
        
        Returns:
            dict: API response with articles
        """
        params = {
            'q': query,
            'language': language,
            'pageSize': min(page_size, 100),
            'sortBy': 'publishedAt',
        }
        
        # Add category to search query if specified
        if category and category.lower() not in ['india', 'world', '']:
            # Append category as a search term to filter results
            params['q'] = f'{query} {category}'
        
        return self._make_request('everything', params)


# Singleton instance
_client = None


def get_news_client():
    """Get or create NewsAPI client instance"""
    global _client
    if _client is None:
        _client = NewsAPIClient()
    return _client
