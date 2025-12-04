// api.js - NewsData.io API communication

// Try to get API key from Vite env, fallback to hardcoded for Live Server
const API_KEY = import.meta.env?.VITE_NEWSDATA_API_KEY || 'pub_46d99e1a6a2a4432b67d2d6afc795778';
const API_BASE_URL = 'https://newsdata.io/api/1';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Debug: Log API key status
console.log('API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No - MISSING!');

// Generate unique ID for an article from its URL
function generateArticleId(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Remove duplicate articles by URL
function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter(a => !seen.has(a.url) && seen.add(a.url));
}

// Transform NewsData.io API response to Article model
function transformArticle(apiArticle, category = 'general') {
  return {
    id: generateArticleId(apiArticle.link || apiArticle.article_id),
    title: apiArticle.title || 'Untitled',
    description: apiArticle.description || 'No description available',
    url: apiArticle.link,
    urlToImage: apiArticle.image_url || '',
    publishedAt: apiArticle.pubDate,
    source: {
      id: apiArticle.source_id || '',
      name: apiArticle.source_name || apiArticle.source_id || 'Unknown Source'
    },
    category: category,
    bookmarked: false
  };
}

// Make API request with retry logic
async function makeRequest(url, retryCount = 0) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw { code: 'RATE_LIMIT', message: 'Rate limit exceeded. Please try again later.', status: 429 };
      } else if (response.status === 401 || response.status === 403) {
        throw { code: 'UNAUTHORIZED', message: 'Invalid API key. Please check your configuration.', status: response.status };
      } else if (response.status === 400) {
        throw { code: 'BAD_REQUEST', message: 'Invalid request. Please check your search query.', status: 400 };
      } else if (response.status >= 500) {
        throw { code: 'SERVER_ERROR', message: 'News service is temporarily unavailable. Please try again.', status: response.status };
      } else {
        throw { code: 'HTTP_ERROR', message: `Request failed with status ${response.status}`, status: response.status };
      }
    }

    const data = await response.json();
    
    console.log('API Response:', { status: data.status, totalResults: data.totalResults, articlesCount: data.results?.length });
    
    if (data.status === 'error') {
      throw { code: data.results?.code || 'API_ERROR', message: data.results?.message || 'An error occurred while fetching news', status: response.status };
    }

    return data;
  } catch (error) {
    if (!error.status && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeRequest(url, retryCount + 1);
    }
    throw error;
  }
}

// Fetch headlines by category
export async function fetchHeadlines(category = 'general', page = 1) {
  try {
    // NewsData.io category mapping
    const categoryMap = {
      'general': 'top',
      'business': 'business',
      'technology': 'technology',
      'sports': 'sports',
      'entertainment': 'entertainment',
      'health': 'health',
      'science': 'science'
    };
    const newsCategory = categoryMap[category] || 'top';
    
    const url = `${API_BASE_URL}/news?apikey=${API_KEY}&category=${newsCategory}&language=en`;
    
    console.log('Fetching headlines:', { category, url: url.replace(API_KEY, 'HIDDEN') });
    
    const data = await makeRequest(url);
    
    const articles = removeDuplicates(
      (data.results || [])
        .filter(a => a.title && a.link)
        .map(a => transformArticle(a, category))
    );

    return {
      status: 'ok',
      totalResults: articles.length,
      articles,
      currentPage: 1,
      totalPages: 1
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    return {
      status: 'error',
      error: { code: error.code || 'FETCH_ERROR', message: error.message || 'Failed to fetch headlines' },
      articles: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

// Search articles by query
export async function searchArticles(query, page = 1) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        status: 'error',
        error: { code: 'INVALID_QUERY', message: 'Search query must be at least 2 characters' },
        articles: [],
        totalResults: 0,
        currentPage: page,
        totalPages: 0
      };
    }

    const sanitizedQuery = encodeURIComponent(query.trim());
    const url = `${API_BASE_URL}/news?apikey=${API_KEY}&q=${sanitizedQuery}&language=en`;
    
    console.log('Searching articles:', { query, url: url.replace(API_KEY, 'HIDDEN') });
    
    const data = await makeRequest(url);
    
    const articles = removeDuplicates(
      (data.results || [])
        .filter(a => a.title && a.link)
        .map(a => transformArticle(a, 'search'))
    );

    return {
      status: 'ok',
      totalResults: articles.length,
      articles,
      currentPage: 1,
      totalPages: 1,
      query: query
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    return {
      status: 'error',
      error: { code: error.code || 'SEARCH_ERROR', message: error.message || 'Failed to search articles' },
      articles: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 0,
      query: query
    };
  }
}
