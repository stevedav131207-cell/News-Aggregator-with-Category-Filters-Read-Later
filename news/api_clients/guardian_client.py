"""The Guardian API client"""
from .base_client import BaseNewsClient


class GuardianClient(BaseNewsClient):
    """Client for The Guardian API"""
    
    BASE_URL = 'https://content.guardianapis.com'
    
    CATEGORY_MAP = {
        'business': 'business',
        'technology': 'technology',
        'sports': 'sport',
        'entertainment': 'culture',
        'science': 'science',
        'world': 'world',
        'india': 'world/india'
    }
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch top headlines from Guardian"""
        params = {
            'api-key': self.api_key,
            'page-size': min(page_size, 50),  # Guardian max is 50
            'show-fields': 'thumbnail,trailText,byline',
            'order-by': 'newest'
        }
        
        # Map category to Guardian section
        if category and category.lower() in self.CATEGORY_MAP:
            params['section'] = self.CATEGORY_MAP[category.lower()]
        elif country == 'in':
            params['section'] = 'world/india'
        
        response = self._make_request(f'{self.BASE_URL}/search', params)
        
        if response.get('response', {}).get('status') == 'ok':
            articles = response['response'].get('results', [])
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'Guardian API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on Guardian"""
        params = {
            'api-key': self.api_key,
            'q': query,
            'page-size': min(page_size, 50),
            'show-fields': 'thumbnail,trailText,byline',
            'order-by': 'relevance'
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['section'] = self.CATEGORY_MAP[category.lower()]
        
        response = self._make_request(f'{self.BASE_URL}/search', params)
        
        if response.get('response', {}).get('status') == 'ok':
            articles = response['response'].get('results', [])
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'Guardian API error'}
    
    def normalize_article(self, article):
        """Convert Guardian article to standard format"""
        fields = article.get('fields', {})
        return {
            'title': article.get('webTitle', ''),
            'description': fields.get('trailText', ''),
            'url': article.get('webUrl', ''),
            'urlToImage': fields.get('thumbnail', ''),
            'publishedAt': article.get('webPublicationDate', ''),
            'source': {'name': 'The Guardian'},
            'content': fields.get('trailText', ''),
            'author': fields.get('byline', ''),
            'api_source': 'Guardian'
        }
