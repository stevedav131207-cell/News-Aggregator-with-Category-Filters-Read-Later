"""NewsAPI.org client"""
from .base_client import BaseNewsClient


class NewsAPIClient(BaseNewsClient):
    """Client for NewsAPI.org"""
    
    BASE_URL = 'https://newsapi.org/v2'
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch top headlines from NewsAPI"""
        # NewsAPI free tier has limited support for top-headlines with country filter
        # Use /everything endpoint with category-specific queries for better results
        
        if category and category.lower() != 'india':
            # For specific categories, use search with category keyword
            query = category.lower()
            if country == 'in':
                query = f'{category} india'
            
            params = {
                'apiKey': self.api_key,
                'q': query,
                'language': language,
                'pageSize': min(page_size, 100),
                'sortBy': 'publishedAt',
            }
            response = self._make_request(f'{self.BASE_URL}/everything', params)
        else:
            # For India/general news, use search with 'india' keyword
            params = {
                'apiKey': self.api_key,
                'q': 'india',
                'language': language,
                'pageSize': min(page_size, 100),
                'sortBy': 'publishedAt',
            }
            response = self._make_request(f'{self.BASE_URL}/everything', params)
        
        if response.get('status') == 'ok':
            response['articles'] = [self.normalize_article(a) for a in response.get('articles', [])]
        
        return response
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on NewsAPI"""
        params = {
            'apiKey': self.api_key,
            'q': query,
            'language': language,
            'pageSize': min(page_size, 100),
            'sortBy': 'publishedAt',
        }
        
        if category and category.lower() not in ['india', 'world', '']:
            params['q'] = f'{query} {category}'
        
        response = self._make_request(f'{self.BASE_URL}/everything', params)
        
        if response.get('status') == 'ok':
            response['articles'] = [self.normalize_article(a) for a in response.get('articles', [])]
        
        return response
    
    def normalize_article(self, article):
        """NewsAPI articles are already in standard format"""
        return {
            'title': article.get('title', ''),
            'description': article.get('description', ''),
            'url': article.get('url', ''),
            'urlToImage': article.get('urlToImage', ''),
            'publishedAt': article.get('publishedAt', ''),
            'source': article.get('source', {'name': 'Unknown'}),
            'content': article.get('content', ''),
            'author': article.get('author', ''),
            'api_source': 'NewsAPI'
        }
