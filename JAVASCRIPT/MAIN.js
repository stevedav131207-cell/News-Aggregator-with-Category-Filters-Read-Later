// MAIN.js - Application entry point

import { getState, setState, subscribe, initializeStore, createBookmark, deleteBookmark, getBookmarks } from './Modules/STORE.js';
import { fetchHeadlines, searchArticles } from './Modules/API.js';
import { renderArticles, renderPagination, renderCategoryFilters, showError, hideError, showLoading, hideLoading, updateBookmarkButton, showUndoNotification, showToast } from './Modules/UI.js';
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

// View mode
let currentView = 'articles'; // 'articles' or 'bookmarks'
let lastRemovedBookmark = null;

// Initialize DOM element references
function initializeElements() {
  elements = {
    articlesContainer: document.getElementById('articles'),
    paginationContainer: document.getElementById('pagination'),
    categoryFilters: document.getElementById('category-filters'),
    searchInput: document.getElementById('search'),
    searchMobileInput: document.getElementById('search-mobile'),
    loadingContainer: document.getElementById('loading'),
    errorContainer: document.getElementById('error'),
    viewBookmarksBtn: document.getElementById('view-bookmarks')
  };
}

// Load and display articles
async function loadArticles() {
  const state = getState();
  const { activeCategory, searchQuery, currentPage } = state;

  showLoading(elements.loadingContainer);
  hideError(elements.errorContainer);

  try {
    let response;

    if (searchQuery) {
      response = await searchArticles(searchQuery, currentPage);
    } else {
      response = await fetchHeadlines(activeCategory, currentPage);
    }

    hideLoading(elements.loadingContainer);

    if (response.status === 'error') {
      showError(response.error.message, elements.errorContainer);
      setState({ articles: [], totalPages: 0 });
      renderArticles([], elements.articlesContainer, getBookmarks(), false);
      renderPagination(1, 0, elements.paginationContainer);
      return;
    }

    // Update state
    setState({
      articles: response.articles,
      totalPages: response.totalPages || Math.ceil(response.totalResults / 10)
    });

    // Render articles and pagination
    renderArticles(response.articles, elements.articlesContainer, getBookmarks(), false);
    renderPagination(currentPage, response.totalPages || 1, elements.paginationContainer);

  } catch (error) {
    hideLoading(elements.loadingContainer);
    console.error('Error loading articles:', error);
    showError('Failed to load articles. Please try again.', elements.errorContainer);
    setState({ articles: [], totalPages: 0 });
  }
}

// Reset to articles view
function resetToArticlesView(category = null) {
  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.searchMobileInput) elements.searchMobileInput.value = '';
  if (elements.viewBookmarksBtn) {
    elements.viewBookmarksBtn.innerHTML = '<span>📚</span> Bookmarks';
  }
  
  currentView = 'articles';
  
  if (category) {
    renderCategoryFilters(CATEGORIES, category, elements.categoryFilters);
  }
}

// Handle category change
function handleCategoryChange(category) {
  setState({
    activeCategory: category,
    currentPage: 1,
    searchQuery: '',
    currentView: 'articles'
  });

  resetToArticlesView(category);
  loadArticles();
}

// Handle logo click
function handleLogoClick() {
  setState({
    activeCategory: 'general',
    currentPage: 1,
    searchQuery: '',
    currentView: 'articles'
  });

  resetToArticlesView('general');
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle search
function handleSearch(query) {
  setState({
    searchQuery: query,
    currentPage: 1,
    currentView: 'articles'
  });

  resetToArticlesView();
  loadArticles();
}

// Handle search clear
function handleSearchClear() {
  setState({
    searchQuery: '',
    currentPage: 1
  });

  loadArticles();
}

// Handle pagination
function handleNextPage() {
  const { currentPage, totalPages } = getState();
  if (currentPage < totalPages) {
    setState({ currentPage: currentPage + 1 });
    loadArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handlePreviousPage() {
  const { currentPage } = getState();
  if (currentPage > 1) {
    setState({ currentPage: currentPage - 1 });
    loadArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Handle bookmark toggle
function handleBookmarkToggle(_articleUrl, articleId, isCurrentlyBookmarked) {
  const state = getState();
  const article = state.articles.find(a => a.id === articleId);

  if (!article) return;

  if (isCurrentlyBookmarked) {
    // Remove bookmark
    lastRemovedBookmark = deleteBookmark(articleId);
    updateBookmarkButton(articleId, false);
    
    // Show undo notification
    showUndoNotification('Bookmark removed', () => {
      if (lastRemovedBookmark) {
        createBookmark(lastRemovedBookmark.article);
        updateBookmarkButton(articleId, true);
        showToast('✅ Bookmark restored!');
      }
    });
  } else {
    // Add bookmark
    createBookmark(article);
    updateBookmarkButton(articleId, true);
    showToast('✅ Bookmark added!');
  }
}

// Handle bookmark delete (from bookmarks view)
function handleBookmarkDelete(articleId) {
  lastRemovedBookmark = deleteBookmark(articleId);
  
  // Show undo notification
  showUndoNotification('Bookmark deleted', () => {
    if (lastRemovedBookmark) {
      createBookmark(lastRemovedBookmark.article);
      showToast('✅ Bookmark restored!');
      if (currentView === 'bookmarks') {
        handleViewBookmarks(); // Refresh bookmarks view
      }
    }
  });

  // Refresh bookmarks view
  if (currentView === 'bookmarks') {
    setTimeout(() => handleViewBookmarks(), 100);
  }
}

// Show bookmarks view
function showBookmarks() {
  currentView = 'bookmarks';
  setState({ currentView: 'bookmarks' });
  
  const bookmarks = getBookmarks();
  const bookmarkedArticles = bookmarks.map(b => b.article);
  
  hideError(elements.errorContainer);
  hideLoading(elements.loadingContainer);
  
  // Add bookmark header
  const headerHtml = bookmarks.length > 0 ? `
    <div class="bookmark-header" style="grid-column: 1/-1;">
      <div class="bookmark-count">📚 ${bookmarks.length} Bookmark${bookmarks.length !== 1 ? 's' : ''}</div>
    </div>
  ` : '';
  
  elements.articlesContainer.innerHTML = headerHtml;
  renderArticles(bookmarkedArticles, elements.articlesContainer, bookmarks, true);
  
  // Hide pagination in bookmarks view
  if (elements.paginationContainer) {
    elements.paginationContainer.style.display = 'none';
  }

  // Update button text
  if (elements.viewBookmarksBtn) {
    elements.viewBookmarksBtn.innerHTML = '<span>📰</span> Back to News';
  }
}

// Show news view
function showNews() {
  currentView = 'articles';
  setState({ currentView: 'articles' });
  
  if (elements.viewBookmarksBtn) {
    elements.viewBookmarksBtn.innerHTML = '<span>📚</span> Bookmarks';
  }
  
  loadArticles();
}

// Handle view bookmarks toggle
const handleViewBookmarks = () => currentView === 'bookmarks' ? showNews() : showBookmarks();

// Initialize the application
export async function init() {
  try {
    console.log('Initializing Samachar app...');
    
    // Initialize DOM elements
    initializeElements();
    console.log('DOM elements initialized');

    // Initialize store
    initializeStore();

    // Render initial UI
    const state = getState();
    renderCategoryFilters(CATEGORIES, state.activeCategory, elements.categoryFilters);

    // Set up event handlers
    const eventHandlers = {
      onCategoryChange: handleCategoryChange,
      onLogoClick: handleLogoClick,
      onSearch: handleSearch,
      onSearchClear: handleSearchClear,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
      onBookmarkToggle: handleBookmarkToggle,
      onBookmarkDelete: handleBookmarkDelete,
      onViewBookmarks: handleViewBookmarks
    };

    // Initialize event listeners
    initializeEventListeners(eventHandlers);

    // Subscribe to state changes
    subscribe((state) => {
      if (import.meta.env?.DEV) {
        console.log('State updated:', state);
      }
    });

    // Load initial articles
    console.log('Loading initial articles...');
    await loadArticles();
    console.log('App initialized successfully!');

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
