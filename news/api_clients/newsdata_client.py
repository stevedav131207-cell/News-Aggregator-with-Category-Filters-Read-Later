"""NewsData.io API client"""
from .base_client import BaseNewsClient


class NewsDataClient(BaseNewsClient):
    """Client for NewsData.io API"""
    
    BASE_URL = 'https://newsdata.io/api/1'
    
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
        """Fetch latest news from NewsData.io"""
        params = {
            'apikey': self.api_key,
            'language': language,
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['category'] = self.CATEGORY_MAP[category.lower()]
        
        if country:
            params['country'] = country
        
        response = self._make_request(f'{self.BASE_URL}/news', params)
        
        if response.get('status') == 'success':
            articles = response.get('results', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'NewsData API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on NewsData.io"""
        params = {
            'apikey': self.api_key,
            'q': query,
            'language': language,
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['category'] = self.CATEGORY_MAP[category.lower()]
        
        response = self._make_request(f'{self.BASE_URL}/news', params)
        
        if response.get('status') == 'success':
            articles = response.get('results', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'NewsData API error'}
    
    def normalize_article(self, article):
        """Convert NewsData article to standard format"""
        return {
            'title': article.get('title', ''),
            'description': article.get('description', ''),
            'url': article.get('link', ''),
            'urlToImage': article.get('image_url', ''),
            'publishedAt': article.get('pubDate', ''),
            'source': {'name': article.get('source_id', 'Unknown')},
            'content': article.get('content', ''),
            'author': article.get('creator', [''])[0] if article.get('creator') else '',
            'api_source': 'NewsData'
        }
