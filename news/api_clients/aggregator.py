"""Multi-API News Aggregator"""
import logging
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor, as_completed
from .newsapi_client import NewsAPIClient
from .guardian_client import GuardianClient
from .nyt_client import NYTimesClient
from .currents_client import CurrentsClient
from .gnews_client import GNewsClient
from .mediastack_client import MediaStackClient
from .newsdata_client import NewsDataClient

logger = logging.getLogger(__name__)


class NewsAggregator:
    """Aggregates news from multiple API sources"""
    
    def __init__(self):
        """Initialize all available API clients"""
        self.clients = []
        
        # Initialize NewsAPI
        if hasattr(settings, 'NEWS_API_KEY') and settings.NEWS_API_KEY:
            self.clients.append(('NewsAPI', NewsAPIClient(settings.NEWS_API_KEY)))
        
        # Initialize Guardian
        if hasattr(settings, 'GUARDIAN_API_KEY') and settings.GUARDIAN_API_KEY:
            self.clients.append(('Guardian', GuardianClient(settings.GUARDIAN_API_KEY)))
        
        # Initialize NYT
        if hasattr(settings, 'NYT_API_KEY') and settings.NYT_API_KEY:
            self.clients.append(('NYT', NYTimesClient(settings.NYT_API_KEY)))
        
        # Initialize Currents
        if hasattr(settings, 'CURRENTS_API_KEY') and settings.CURRENTS_API_KEY:
            self.clients.append(('Currents', CurrentsClient(settings.CURRENTS_API_KEY)))
        
        # Initialize GNews
        if hasattr(settings, 'GNEWS_API_KEY') and settings.GNEWS_API_KEY:
            self.clients.append(('GNews', GNewsClient(settings.GNEWS_API_KEY)))
        
        # Initialize MediaStack
        if hasattr(settings, 'MEDIASTACK_API_KEY') and settings.MEDIASTACK_API_KEY:
            self.clients.append(('MediaStack', MediaStackClient(settings.MEDIASTACK_API_KEY)))
        
        # Initialize NewsData
        if hasattr(settings, 'NEWSDATA_API_KEY') and settings.NEWSDATA_API_KEY:
            self.clients.append(('NewsData', NewsDataClient(settings.NEWSDATA_API_KEY)))
        
        logger.info(f'Initialized {len(self.clients)} news API clients')
    
    def _fetch_from_client(self, client_name, client, method, *args, **kwargs):
        """Fetch news from a single client with error handling"""
        try:
            result = getattr(client, method)(*args, **kwargs)
            if result.get('status') == 'ok':
                logger.info(f'{client_name}: Fetched {len(result.get("articles", []))} articles')
                return result.get('articles', [])
            else:
                logger.warning(f'{client_name}: {result.get("message", "Unknown error")}')
                return []
        except Exception as e:
            logger.error(f'{client_name}: Exception - {str(e)}')
            return []
    
    def _deduplicate_articles(self, articles):
        """Remove duplicate articles based on title similarity"""
        seen_titles = set()
        unique_articles = []
        
        for article in articles:
            title = article.get('title', '').lower().strip()
            # Simple deduplication by title
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique_articles.append(article)
        
        return unique_articles
    
    def _sort_articles(self, articles):
        """Sort articles by publication date (newest first)"""
        def get_date(article):
            date_str = article.get('publishedAt', '')
            if date_str:
                return date_str
            return ''
        
        return sorted(articles, key=get_date, reverse=True)
    
    def get_top_headlines(self, category=None, country='in', page_size=100, language='en'):
        """
        Fetch top headlines from all available APIs and aggregate results
        
        Args:
            category: News category
            country: Country code
            page_size: Maximum number of articles to return
            language: Language code
        
        Returns:
            dict: Aggregated response with articles from all sources
        """
        all_articles = []
        
        # Fetch from all clients in parallel
        with ThreadPoolExecutor(max_workers=len(self.clients)) as executor:
            futures = {
                executor.submit(
                    self._fetch_from_client,
                    name,
                    client,
                    'get_top_headlines',
                    category=category,
                    country=country,
                    page_size=page_size,
                    language=language
                ): name for name, client in self.clients
            }
            
            for future in as_completed(futures):
                articles = future.result()
                all_articles.extend(articles)
        
        # Deduplicate and sort
        unique_articles = self._deduplicate_articles(all_articles)
        sorted_articles = self._sort_articles(unique_articles)
        
        # Limit to requested page size
        final_articles = sorted_articles[:page_size]
        
        logger.info(f'Aggregated {len(final_articles)} unique articles from {len(self.clients)} sources')
        
        return {
            'status': 'ok',
            'totalResults': len(final_articles),
            'articles': final_articles,
            'sources_used': len(self.clients)
        }
    
    def search_news(self, query, category=None, page_size=100, language='en'):
        """
        Search news across all available APIs and aggregate results
        
        Args:
            query: Search keyword
            category: Optional category filter
            page_size: Maximum number of articles to return
            language: Language code
        
        Returns:
            dict: Aggregated search results from all sources
        """
        all_articles = []
        
        # Search across all clients in parallel
        with ThreadPoolExecutor(max_workers=len(self.clients)) as executor:
            futures = {
                executor.submit(
                    self._fetch_from_client,
                    name,
                    client,
                    'search_news',
                    query=query,
                    category=category,
                    page_size=page_size,
                    language=language
                ): name for name, client in self.clients
            }
            
            for future in as_completed(futures):
                articles = future.result()
                all_articles.extend(articles)
        
        # Deduplicate and sort
        unique_articles = self._deduplicate_articles(all_articles)
        sorted_articles = self._sort_articles(unique_articles)
        
        # Limit to requested page size
        final_articles = sorted_articles[:page_size]
        
        logger.info(f'Search "{query}": Found {len(final_articles)} unique articles from {len(self.clients)} sources')
        
        return {
            'status': 'ok',
            'totalResults': len(final_articles),
            'articles': final_articles,
            'sources_used': len(self.clients)
        }


# Singleton instance
_aggregator = None


def get_news_aggregator():
    """Get or create NewsAggregator instance"""
    global _aggregator
    if _aggregator is None:
        _aggregator = NewsAggregator()
    return _aggregator
