"""New York Times API client"""
from .base_client import BaseNewsClient


class NYTimesClient(BaseNewsClient):
    """Client for New York Times API"""
    
    BASE_URL = 'https://api.nytimes.com/svc'
    
    CATEGORY_MAP = {
        'business': 'business',
        'technology': 'technology',
        'sports': 'sports',
        'entertainment': 'arts',
        'science': 'science',
        'world': 'world'
    }
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """Fetch top stories from NYT"""
        section = 'home'
        if category and category.lower() in self.CATEGORY_MAP:
            section = self.CATEGORY_MAP[category.lower()]
        
        params = {'api-key': self.api_key}
        
        response = self._make_request(
            f'{self.BASE_URL}/topstories/v2/{section}.json',
            params
        )
        
        if response.get('status') == 'OK':
            articles = response.get('results', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'NYT API error'}
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """Search news on NYT"""
        params = {
            'api-key': self.api_key,
            'q': query,
            'sort': 'newest'
        }
        
        if category and category.lower() in self.CATEGORY_MAP:
            params['fq'] = f'section_name:("{self.CATEGORY_MAP[category.lower()]}")'
        
        response = self._make_request(
            f'{self.BASE_URL}/search/v2/articlesearch.json',
            params
        )
        
        if response.get('status') == 'OK':
            articles = response.get('response', {}).get('docs', [])[:page_size]
            return {
                'status': 'ok',
                'articles': [self.normalize_article(a) for a in articles]
            }
        
        return {'status': 'error', 'articles': [], 'message': 'NYT API error'}
    
    def normalize_article(self, article):
        """Convert NYT article to standard format"""
        # Handle both top stories and search results formats
        if 'multimedia' in article:
            # Top stories format
            image = ''
            if article.get('multimedia'):
                for media in article['multimedia']:
                    if media.get('format') in ['superJumbo', 'mediumThreeByTwo440']:
                        image = media.get('url', '')
                        break
            
            return {
                'title': article.get('title', ''),
                'description': article.get('abstract', ''),
                'url': article.get('url', ''),
                'urlToImage': image,
                'publishedAt': article.get('published_date', ''),
                'source': {'name': 'New York Times'},
                'content': article.get('abstract', ''),
                'author': article.get('byline', ''),
                'api_source': 'NYT'
            }
        else:
            # Search results format
            image = ''
            if article.get('multimedia'):
                image = f"https://www.nytimes.com/{article['multimedia'][0]['url']}"
            
            return {
                'title': article.get('headline', {}).get('main', ''),
                'description': article.get('abstract', ''),
                'url': article.get('web_url', ''),
                'urlToImage': image,
                'publishedAt': article.get('pub_date', ''),
                'source': {'name': 'New York Times'},
                'content': article.get('lead_paragraph', ''),
                'author': article.get('byline', {}).get('original', ''),
                'api_source': 'NYT'
            }
