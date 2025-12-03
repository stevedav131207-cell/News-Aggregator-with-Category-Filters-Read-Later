// STORE.js - Application state management and persistent storage

// Initial state structure
let state = {
  articles: [],
  currentPage: 1,
  totalPages: 0,
  activeCategory: 'general',
  searchQuery: '',
  sortBy: 'publishedAt',
  bookmarks: [],
  loading: false,
  error: null,
  lastFetch: null
};

// Subscribers for state changes
const subscribers = [];

// Storage keys
const CACHE_PREFIX = 'news_cache_';
const BOOKMARKS_KEY = 'news_bookmarks';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

// Check for IndexedDB support
const hasIndexedDB = typeof indexedDB !== 'undefined';

/**
 * Get current application state
 * @returns {Object} Current state object
 */
export function getState() {
  return { ...state };
}

/**
 * Update application state with new values
 * @param {Object} updates - Partial state updates
 */
export function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

/**
 * Subscribe to state changes
 * @param {Function} listener - Callback function to be called on state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(listener) {
  subscribers.push(listener);
  return () => {
    const index = subscribers.indexOf(listener);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Notify all subscribers of state changes
 */
function notifySubscribers() {
  subscribers.forEach(listener => listener(state));
}

/**
 * Cache articles with TTL
 * @param {string} key - Cache key (category or search query)
 * @param {Array} articles - Articles to cache
 * @param {number} ttl - Time to live in milliseconds (default: 15 minutes)
 */
export function cacheArticles(key, articles, ttl = CACHE_TTL) {
  const cacheEntry = {
    key,
    data: articles,
    timestamp: Date.now(),
    ttl
  };

  try {
    if (hasIndexedDB) {
      // Use IndexedDB for caching (preferred)
      cacheToIndexedDB(key, cacheEntry);
    } else {
      // Fallback to localStorage
      const cacheKey = CACHE_PREFIX + key;
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    }
  } catch (error) {
    console.error('Error caching articles:', error);
    // If quota exceeded, clear old cache entries
    if (error.name === 'QuotaExceededError') {
      clearOldCacheEntries();
    }
  }
}

/**
 * Get cached articles if not expired
 * @param {string} key - Cache key
 * @returns {Array|null} Cached articles or null if not found/expired
 */
export function getCachedArticles(key) {
  try {
    let cacheEntry = null;

    if (hasIndexedDB) {
      // This is async, but we'll use localStorage as fallback for sync access
      // In a real implementation, this would be async
      const cacheKey = CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        cacheEntry = JSON.parse(cached);
      }
    } else {
      const cacheKey = CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        cacheEntry = JSON.parse(cached);
      }
    }

    if (!cacheEntry) {
      return null;
    }

    // Validate cache structure
    if (!cacheEntry.data || !cacheEntry.timestamp || !cacheEntry.ttl) {
      console.warn('Invalid cache structure, clearing entry');
      clearCacheEntry(key);
      return null;
    }

    // Check if cache is expired
    const now = Date.now();
    const age = now - cacheEntry.timestamp;
    
    if (age > cacheEntry.ttl) {
      clearCacheEntry(key);
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Error retrieving cached articles:', error);
    return null;
  }
}

/**
 * Cache to IndexedDB (simplified implementation)
 * @param {string} key - Cache key
 * @param {Object} cacheEntry - Cache entry object
 */
function cacheToIndexedDB(key, cacheEntry) {
  // For now, use localStorage as IndexedDB is async
  // A full implementation would use proper IndexedDB API
  const cacheKey = CACHE_PREFIX + key;
  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
}

/**
 * Clear a specific cache entry
 * @param {string} key - Cache key to clear
 */
function clearCacheEntry(key) {
  const cacheKey = CACHE_PREFIX + key;
  localStorage.removeItem(cacheKey);
}

/**
 * Clear old cache entries to free up space
 */
function clearOldCacheEntries() {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheEntry = JSON.parse(cached);
            const age = now - cacheEntry.timestamp;
            
            if (age > cacheEntry.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // If parsing fails, remove the corrupted entry
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing old cache entries:', error);
  }
}

/**
 * Clear all cache entries
 */
export function clearCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Save an article to bookmarks
 * @param {Object} article - Article to bookmark
 */
export function saveBookmark(article) {
  try {
    const bookmarks = getBookmarks();
    
    // Check if already bookmarked
    const exists = bookmarks.find(b => b.id === article.id);
    if (exists) {
      return;
    }

    const bookmark = {
      article,
      savedAt: Date.now(),
      id: article.id
    };

    bookmarks.push(bookmark);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    
    // Update state
    setState({ bookmarks });
  } catch (error) {
    console.error('Error saving bookmark:', error);
  }
}

/**
 * Remove an article from bookmarks
 * @param {string} articleId - ID of article to remove
 * @returns {Object|null} Removed bookmark or null
 */
export function removeBookmark(articleId) {
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.findIndex(b => b.id === articleId);
    
    if (index === -1) {
      return null;
    }

    const removed = bookmarks.splice(index, 1)[0];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    
    // Update state
    setState({ bookmarks });
    
    return removed;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return null;
  }
}

/**
 * Get all bookmarks
 * @returns {Array} Array of bookmark objects
 */
export function getBookmarks() {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (!stored) {
      return [];
    }

    const bookmarks = JSON.parse(stored);
    
    // Validate bookmarks structure
    if (!Array.isArray(bookmarks)) {
      console.warn('Invalid bookmarks structure, resetting');
      localStorage.removeItem(BOOKMARKS_KEY);
      return [];
    }

    return bookmarks;
  } catch (error) {
    console.error('Error retrieving bookmarks:', error);
    return [];
  }
}

/**
 * Initialize store with bookmarks from storage
 */
export function initializeStore() {
  const bookmarks = getBookmarks();
  setState({ bookmarks });
}
