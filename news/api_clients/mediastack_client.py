"""MediaStack API client"""
from .base_client import BaseNewsClient


class MediaStackClient(BaseNewsClient):
    """Client for MediaStack API"""
    
    BASE_URL = 'http://api.mediastack.com/v1'
    
    CATEGORY_MAP = {
        'business': 'business',
        'technology': 'technology',
        'sports': 'sports',
        'entertainment': 'entertainment',
        'science': 'science',
        'health': 'health'
    }
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch news from MediaStack"""
        params = {
            'access_key': self.api_key,
            'languages': language,
            'limit': min(page_size, 100),
            'sort': 'published_desc'
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['categories'] = self.CATEGORY_MAP[category.lower()]
        
        if country:
            params['countries'] = country
        
        response = self._make_request(f'{self.BASE_URL}/news', params)
        
        if 'data' in response:
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in response.get('data', [])]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'MediaStack API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on MediaStack"""
        params = {
            'access_key': self.api_key,
            'keywords': query,
            'languages': language,
            'limit': min(page_size, 100),
            'sort': 'published_desc'
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['categories'] = self.CATEGORY_MAP[category.lower()]
        
        response = self._make_request(f'{self.BASE_URL}/news', params)
        
        if 'data' in response:
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in response.get('data', [])]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'MediaStack API error'}
    
    def normalize_article(self, article):
        """Convert MediaStack article to standard format"""
        return {
            'title': article.get('title', ''),
            'description': article.get('description', ''),
            'url': article.get('url', ''),
            'urlToImage': article.get('image', ''),
            'publishedAt': article.get('published_at', ''),
            'source': {'name': article.get('source', 'Unknown')},
            'content': article.get('description', ''),
            'author': article.get('author', ''),
            'api_source': 'MediaStack'
        }
