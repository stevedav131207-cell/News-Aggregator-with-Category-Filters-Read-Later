// MAIN.js - Application entry point

import { getState, setState, subscribe, initializeStore, cacheArticles, getCachedArticles, saveBookmark, removeBookmark, getBookmarks } from './Modules/STORE.js';
import { fetchHeadlines, searchArticles } from './Modules/API.js';
import { renderArticles, renderPagination, renderCategoryFilters, renderSortControls, showError, hideError, showLoading, hideLoading, updateBookmarkButton, showUndoNotification } from './Modules/UI.js';
import { initializeEventListeners } from './Modules/EVENTS.js';

// DOM elements
let elements = {};

// Categories configuration
const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' }
];

// View modes
let currentView = 'articles'; // 'articles' or 'bookmarks'
let lastRemovedBookmark = null;

/**
 * Check browser compatibility
 * @returns {boolean} Whether browser is compatible
 */
function checkBrowserCompatibility() {
  const hasLocalStorage = typeof localStorage !== 'undefined';
  const hasFetch = typeof fetch !== 'undefined';
  const hasES6 = typeof Promise !== 'undefined';

  if (!hasLocalStorage || !hasFetch || !hasES6) {
    console.error('Browser compatibility check failed');
    return false;
  }

  return true;
}

/**
 * Initialize DOM element references
 */
function initializeElements() {
  elements = {
    articlesContainer: document.getElementById('articles'),
    paginationContainer: document.getElementById('pagination'),
    categoryFilters: document.getElementById('category-filters'),
    sortControls: document.getElementById('sort-controls'),
    searchInput: document.getElementById('search'),
    loadingContainer: document.getElementById('loading'),
    errorContainer: document.getElementById('error'),
    viewBookmarksBtn: document.getElementById('view-bookmarks')
  };
}

/**
 * Load and display articles
 */
async function loadArticles() {
  const state = getState();
  const { activeCategory, searchQuery, currentPage, sortBy } = state;

  // Show loading
  showLoading(elements.loadingContainer);
  hideError(elements.errorContainer);

  try {
    let response;
    let cacheKey;

    if (searchQuery) {
      // Search mode
      cacheKey = `search_${searchQuery}_${currentPage}`;
      const cached = getCachedArticles(cacheKey);

      if (cached) {
        response = {
          status: 'ok',
          articles: cached,
          totalResults: cached.length,
          currentPage: currentPage
        };
      } else {
        response = await searchArticles(searchQuery, currentPage);
        if (response.status === 'ok' && response.articles.length > 0) {
          cacheArticles(cacheKey, response.articles);
        }
      }
    } else {
      // Category mode
      cacheKey = `${activeCategory}_${currentPage}`;
      const cached = getCachedArticles(cacheKey);

      if (cached) {
        response = {
          status: 'ok',
          articles: cached,
          totalResults: cached.length,
          currentPage: currentPage
        };
      } else {
        response = await fetchHeadlines(activeCategory, currentPage);
        if (response.status === 'ok' && response.articles.length > 0) {
          cacheArticles(cacheKey, response.articles);
        }
      }
    }

    hideLoading(elements.loadingContainer);

    if (response.status === 'error') {
      showError(response.error.message, elements.errorContainer);
      setState({ articles: [], totalPages: 0, error: response.error.message });
      renderArticles([], elements.articlesContainer, getBookmarks());
      renderPagination(1, 0, elements.paginationContainer);
      return;
    }

    // Sort articles if needed
    let articles = response.articles;
    if (sortBy === 'publishedAt') {
      articles = [...articles].sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    }

    // Update state
    setState({
      articles: articles,
      totalPages: response.totalPages || Math.ceil(response.totalResults / 10),
      error: null,
      lastFetch: Date.now()
    });

    // Render articles and pagination
    renderArticles(articles, elements.articlesContainer, getBookmarks());
    renderPagination(currentPage, response.totalPages || 1, elements.paginationContainer);

  } catch (error) {
    hideLoading(elements.loadingContainer);
    console.error('Error loading articles:', error);
    showError('Failed to load articles. Please try again.', elements.errorContainer);
    setState({ articles: [], totalPages: 0, error: error.message });
  }
}

/**
 * Handle category change
 * @param {string} category - Selected category
 */
function handleCategoryChange(category) {
  setState({
    activeCategory: category,
    currentPage: 1,
    searchQuery: ''
  });

  // Clear search input
  if (elements.searchInput) {
    elements.searchInput.value = '';
  }

  // Update UI
  renderCategoryFilters(CATEGORIES, category, elements.categoryFilters);
  
  // Switch to articles view if in bookmarks
  if (currentView === 'bookmarks') {
    currentView = 'articles';
  }

  loadArticles();
}

/**
 * Handle search
 * @param {string} query - Search query
 */
function handleSearch(query) {
  setState({
    searchQuery: query,
    currentPage: 1
  });

  loadArticles();
}

/**
 * Handle search clear
 */
function handleSearchClear() {
  setState({
    searchQuery: '',
    currentPage: 1
  });

  loadArticles();
}

/**
 * Handle pagination - next page
 */
function handleNextPage() {
  const state = getState();
  if (state.currentPage < state.totalPages) {
    setState({ currentPage: state.currentPage + 1 });
    loadArticles();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Handle pagination - previous page
 */
function handlePreviousPage() {
  const state = getState();
  if (state.currentPage > 1) {
    setState({ currentPage: state.currentPage - 1 });
    loadArticles();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Handle sort change
 * @param {string} sortBy - Sort option
 */
function handleSortChange(sortBy) {
  setState({
    sortBy: sortBy,
    currentPage: 1
  });

  renderSortControls(sortBy, elements.sortControls);
  loadArticles();
}

/**
 * Handle bookmark toggle
 * @param {string} articleId - Article ID
 * @param {boolean} isCurrentlyBookmarked - Current bookmark state
 */
function handleBookmarkToggle(articleId, isCurrentlyBookmarked) {
  const state = getState();
  const article = state.articles.find(a => a.id === articleId);

  if (!article) {
    // Try to find in bookmarks
    const bookmark = getBookmarks().find(b => b.id === articleId);
    if (bookmark && isCurrentlyBookmarked) {
      lastRemovedBookmark = removeBookmark(articleId);
      updateBookmarkButton(articleId, false);
      
      // Show undo notification
      showUndoNotification('Bookmark removed', () => {
        if (lastRemovedBookmark) {
          saveBookmark(lastRemovedBookmark.article);
          updateBookmarkButton(articleId, true);
          
          // Refresh bookmarks view if active
          if (currentView === 'bookmarks') {
            handleViewBookmarks();
          }
        }
      });

      // Refresh bookmarks view if active
      if (currentView === 'bookmarks') {
        setTimeout(() => handleViewBookmarks(), 100);
      }
    }
    return;
  }

  if (isCurrentlyBookmarked) {
    // Remove bookmark
    lastRemovedBookmark = removeBookmark(articleId);
    updateBookmarkButton(articleId, false);
    
    // Show undo notification
    showUndoNotification('Bookmark removed', () => {
      if (lastRemovedBookmark) {
        saveBookmark(lastRemovedBookmark.article);
        updateBookmarkButton(articleId, true);
      }
    });
  } else {
    // Add bookmark
    saveBookmark(article);
    updateBookmarkButton(articleId, true);
  }
}

/**
 * Handle view bookmarks
 */
function handleViewBookmarks() {
  currentView = 'bookmarks';
  const bookmarks = getBookmarks();
  
  hideError(elements.errorContainer);
  hideLoading(elements.loadingContainer);
  
  renderArticles(bookmarks.map(b => b.article), elements.articlesContainer, bookmarks);
  
  // Hide pagination in bookmarks view
  if (elements.paginationContainer) {
    elements.paginationContainer.style.display = 'none';
  }

  // Update view bookmarks button text
  if (elements.viewBookmarksBtn) {
    elements.viewBookmarksBtn.innerHTML = '<span aria-hidden="true">📰</span> Back to News';
    elements.viewBookmarksBtn.setAttribute('aria-label', 'Back to news articles');
  }

  // Change button behavior to go back
  elements.viewBookmarksBtn.onclick = () => {
    currentView = 'articles';
    elements.viewBookmarksBtn.innerHTML = '<span aria-hidden="true">📚</span> Bookmarks';
    elements.viewBookmarksBtn.setAttribute('aria-label', 'View bookmarked articles');
    loadArticles();
  };
}

/**
 * Initialize the application
 */
export async function init() {
  try {
    // Check browser compatibility
    if (!checkBrowserCompatibility()) {
      alert('Your browser is not supported. Please use a modern browser.');
      return;
    }

    // Initialize DOM elements
    initializeElements();

    // Initialize store
    initializeStore();

    // Render initial UI
    const state = getState();
    renderCategoryFilters(CATEGORIES, state.activeCategory, elements.categoryFilters);
    renderSortControls(state.sortBy, elements.sortControls);

    // Set up event handlers
    const eventHandlers = {
      onCategoryChange: handleCategoryChange,
      onSearch: handleSearch,
      onSearchClear: handleSearchClear,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
      onSortChange: handleSortChange,
      onBookmarkToggle: handleBookmarkToggle,
      onViewBookmarks: handleViewBookmarks
    };

    // Initialize event listeners
    initializeEventListeners(eventHandlers);

    // Subscribe to state changes
    subscribe((state) => {
      if (import.meta.env.DEV) {
        console.log('State updated:', state);
      }
    });

    // Load initial articles
    await loadArticles();

    // Set up error boundary
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      showError('An unexpected error occurred. Please refresh the page.', elements.errorContainer);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      showError('An unexpected error occurred. Please refresh the page.', elements.errorContainer);
    });

  } catch (error) {
    console.error('Initialization error:', error);
    alert('Failed to initialize application. Please refresh the page.');
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
