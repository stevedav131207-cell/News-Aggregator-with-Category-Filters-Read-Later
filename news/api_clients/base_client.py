"""Base client class for all news API clients"""
import requests
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class BaseNewsClient(ABC):
    """Abstract base class for news API clients"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.timeout = 10
    
    def _make_request(self, url, params, headers=None):
        """Make HTTP request with error handling"""
        try:
            response = requests.get(url, params=params, headers=headers, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f'{self.__class__.__name__} request failed: {e}')
            return {'status': 'error', 'articles': [], 'message': str(e)}
    
    @abstractmethod
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch top headlines - must be implemented by subclasses"""
        pass
    
    @abstractmethod
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news - must be implemented by subclasses"""
        pass
    
    @abstractmethod
    def normalize_article(self, article):
        """Normalize article format to standard structure"""
        pass
    
    def get_standard_article_format(self):
        """Standard article format for all APIs"""
        return {
            'title': '',
            'description': '',
            'url': '',
            'urlToImage': '',
            'publishedAt': '',
            'source': {'name': ''},
            'content': '',
            'author': ''
        }
