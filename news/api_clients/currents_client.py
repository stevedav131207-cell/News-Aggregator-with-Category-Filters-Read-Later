"""Currents API client"""
from .base_client import BaseNewsClient


class CurrentsClient(BaseNewsClient):
    """Client for Currents API"""
    
    BASE_URL = 'https://api.currentsapi.services/v1'
    
    CATEGORY_MAP = {
        'business': 'business',
        'technology': 'technology',
        'sports': 'sports',
        'entertainment': 'entertainment',
        'science': 'science',
        'world': 'world',
        'india': 'regional'
    }
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch latest news from Currents"""
        params = {
            'apiKey': self.api_key,
            'language': language,
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['category'] = self.CATEGORY_MAP[category.lower()]
        
        if country:
            params['country'] = country
        
        response = self._make_request(f'{self.BASE_URL}/latest-news', params)
        
        if response.get('status') == 'ok':
            articles = response.get('news', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'Currents API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on Currents"""
        params = {
            'apiKey': self.api_key,
            'keywords': query,
            'language': language,
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['category'] = self.CATEGORY_MAP[category.lower()]
        
        response = self._make_request(f'{self.BASE_URL}/search', params)
        
        if response.get('status') == 'ok':
            articles = response.get('news', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'Currents API error'}
    
    def normalize_article(self, article):
        """Convert Currents article to standard format"""
        return {
            'title': article.get('title', ''),
            'description': article.get('description', ''),
            'url': article.get('url', ''),
            'urlToImage': article.get('image', ''),
            'publishedAt': article.get('published', ''),
            'source': {'name': article.get('author', 'Unknown')},
            'content': article.get('description', ''),
            'author': article.get('author', ''),
            'api_source': 'Currents'
        }
