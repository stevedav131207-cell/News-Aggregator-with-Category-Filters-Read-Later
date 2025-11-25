"""GNews API client"""
from .base_client import BaseNewsClient


class GNewsClient(BaseNewsClient):
    """Client for GNews API"""
    
    BASE_URL = 'https://gnews.io/api/v4'
    
    CATEGORY_MAP = {
        'business': 'business',
        'technology': 'technology',
        'sports': 'sports',
        'entertainment': 'entertainment',
        'science': 'science',
        'world': 'world',
        'health': 'health'
    }
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch top headlines from GNews"""
        params = {
            'apikey': self.api_key,
            'lang': language,
            'max': min(page_size, 100),
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['topic'] = self.CATEGORY_MAP[category.lower()]
        
        if country:
            params['country'] = country
        
        response = self._make_request(f'{self.BASE_URL}/top-headlines', params)
        
        if 'articles' in response:
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in response.get('articles', [])]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'GNews API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on GNews"""
        params = {
            'apikey': self.api_key,
            'q': query,
            'lang': language,
            'max': min(page_size, 100),
            'sortby': 'publishedAt'
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['topic'] = self.CATEGORY_MAP[category.lower()]
        
        response = self._make_request(f'{self.BASE_URL}/search', params)
        
        if 'articles' in response:
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in response.get('articles', [])]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'GNews API error'}
    
    def normalize_article(self, article):
        """Convert GNews article to standard format"""
        return {
            'title': article.get('title', ''),
            'description': article.get('description', ''),
            'url': article.get('url', ''),
            'urlToImage': article.get('image', ''),
            'publishedAt': article.get('publishedAt', ''),
            'source': article.get('source', {'name': 'Unknown'}),
            'content': article.get('content', ''),
            'author': '',
            'api_source': 'GNews'
        }
