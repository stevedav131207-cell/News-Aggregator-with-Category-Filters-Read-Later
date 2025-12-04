// API.js - News API communication

// Try to get API key from Vite env, fallback to hardcoded for Live Server
const API_KEY = import.meta.env?.VITE_NEWS_API_KEY || '109ffe55c2324d04bdbdd9b1f9c1ad1d';
const API_BASE_URL = 'https://newsapi.org/v2';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Debug: Log API key status
console.log('API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No - MISSING!');

// API status tracking
let apiStatus = {
  healthy: true,
  lastError: null,
  rateLimitRemaining: null
};

// Generate unique ID for an article from its URL
function generateArticleId(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Transform API response to Article model
function transformArticle(apiArticle, category = 'general') {
  return {
    id: generateArticleId(apiArticle.url),
    title: apiArticle.title || 'Untitled',
    description: apiArticle.description || 'No description available',
    url: apiArticle.url,
    urlToImage: apiArticle.urlToImage || '',
    publishedAt: apiArticle.publishedAt,
    source: {
      id: apiArticle.source?.id || '',
      name: apiArticle.source?.name || 'Unknown Source'
    },
    category: category,
    bookmarked: false
  };
}

// Make API request with retry logic
async function makeRequest(url, retryCount = 0) {
  try {
    const response = await fetch(url);
    
    // Update rate limit info from headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining) {
      apiStatus.rateLimitRemaining = parseInt(remaining, 10);
    }

    if (!response.ok) {
      // Handle specific HTTP errors
      if (response.status === 429) {
        throw {
          code: 'RATE_LIMIT',
          message: 'Rate limit exceeded. Please try again later.',
          status: 429
        };
      } else if (response.status === 401) {
        throw {
          code: 'UNAUTHORIZED',
          message: 'Invalid API key. Please check your configuration.',
          status: 401
        };
      } else if (response.status === 400) {
        throw {
          code: 'BAD_REQUEST',
          message: 'Invalid request. Please check your search query.',
          status: 400
        };
      } else if (response.status >= 500) {
        throw {
          code: 'SERVER_ERROR',
          message: 'News service is temporarily unavailable. Please try again.',
          status: response.status
        };
      } else {
        throw {
          code: 'HTTP_ERROR',
          message: `Request failed with status ${response.status}`,
          status: response.status
        };
      }
    }

    const data = await response.json();
    
    console.log('API Response:', { status: data.status, totalResults: data.totalResults, articlesCount: data.articles?.length });
    
    // Check for API error response
    if (data.status === 'error') {
      throw {
        code: data.code || 'API_ERROR',
        message: data.message || 'An error occurred while fetching news',
        status: response.status
      };
    }

    apiStatus.healthy = true;
    apiStatus.lastError = null;
    
    return data;
  } catch (error) {
    // If it's a network error and we have retries left
    if (!error.status && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeRequest(url, retryCount + 1);
    }

    // Update API status
    apiStatus.healthy = false;
    apiStatus.lastError = error;

    throw error;
  }
}

// Fetch headlines by category and page number
export async function fetchHeadlines(category = 'general', page = 1) {
  try {
    const pageSize = 10;
    const url = `${API_BASE_URL}/top-headlines?category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    
    console.log('Fetching headlines:', { category, page, url: url.replace(API_KEY, 'HIDDEN') });
    
    const data = await makeRequest(url);
    
    // Transform articles
    const articles = (data.articles || [])
      .filter(article => article.title && article.url) // Filter out invalid articles
      .map(article => transformArticle(article, category));

    return {
      status: 'ok',
      totalResults: data.totalResults || 0,
      articles: articles,
      currentPage: page,
      totalPages: Math.ceil((data.totalResults || 0) / pageSize)
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    return {
      status: 'error',
      error: {
        code: error.code || 'FETCH_ERROR',
        message: error.message || 'Failed to fetch headlines'
      },
      articles: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

// Search articles by query and page number
export async function searchArticles(query, page = 1) {
  try {
    // Validate query
    if (!query || query.trim().length < 2) {
      return {
        status: 'error',
        error: {
          code: 'INVALID_QUERY',
          message: 'Search query must be at least 2 characters'
        },
        articles: [],
        totalResults: 0,
        currentPage: page,
        totalPages: 0
      };
    }

    const pageSize = 10;
    const sanitizedQuery = encodeURIComponent(query.trim());
    const url = `${API_BASE_URL}/everything?q=${sanitizedQuery}&page=${page}&pageSize=${pageSize}&sortBy=publishedAt&apiKey=${API_KEY}`;
    
    const data = await makeRequest(url);
    
    // Transform articles
    const articles = (data.articles || [])
      .filter(article => article.title && article.url)
      .map(article => transformArticle(article, 'search'));

    return {
      status: 'ok',
      totalResults: data.totalResults || 0,
      articles: articles,
      currentPage: page,
      totalPages: Math.ceil((data.totalResults || 0) / pageSize),
      query: query
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    return {
      status: 'error',
      error: {
        code: error.code || 'SEARCH_ERROR',
        message: error.message || 'Failed to search articles'
      },
      articles: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 0,
      query: query
    };
  }
}
