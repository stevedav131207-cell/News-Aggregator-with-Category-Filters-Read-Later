 // events.js - Event handling and user interactions

// Event handlers storage
let eventHandlers = {};

// Create debounced function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Initialize all event listeners
export function initializeEventListeners(handlers) {
  eventHandlers = handlers;

  // Attach search events for both desktop and mobile
  const searchInput = document.getElementById('search');
  const searchMobileInput = document.getElementById('search-mobile');
  
  if (searchInput) {
    attachSearchEvents(searchInput);
  }
  
  if (searchMobileInput) {
    attachSearchEvents(searchMobileInput);
  }

  // Attach category events
  const categoryContainer = document.getElementById('category-filters');
  if (categoryContainer) {
    attachCategoryEvents(categoryContainer);
  }

  // Attach pagination events
  const paginationContainer = document.getElementById('pagination');
  if (paginationContainer) {
    attachPaginationEvents(paginationContainer);
  }

  // Attach bookmark view button
  const bookmarksBtn = document.getElementById('view-bookmarks');
  if (bookmarksBtn) {
    bookmarksBtn.addEventListener('click', () => {
      if (eventHandlers.onViewBookmarks) {
        eventHandlers.onViewBookmarks();
      }
    });
  }

  // Attach logo click event
  const siteLogo = document.getElementById('site-logo');
  if (siteLogo) {
    siteLogo.addEventListener('click', (e) => {
      e.preventDefault();
      if (eventHandlers.onLogoClick) {
        eventHandlers.onLogoClick();
      }
    });
  }

  // Attach article events (using delegation on articles container)
  const articlesContainer = document.getElementById('articles');
  if (articlesContainer) {
    attachArticleEvents(articlesContainer);
  }
}

// Attach search events with debouncing
export function attachSearchEvents(searchInput) {
  if (!searchInput) return;

  let lastSearchQuery = '';

  // Debounced search handler (800ms)
  const debouncedSearch = debounce((query) => {
    if (eventHandlers.onSearch) {
      eventHandlers.onSearch(query);
    }
  }, 800);

  // Input event for search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Only search if query has at least 2 characters
    if (query.length < 2) {
      // If search was active and now cleared, restore default articles
      if (lastSearchQuery !== '' && query === '') {
        lastSearchQuery = '';
        if (eventHandlers.onSearchClear) {
          eventHandlers.onSearchClear();
        }
      }
      return;
    }
    
    lastSearchQuery = query;
    debouncedSearch(query);
  });
}

// Attach category filter events
export function attachCategoryEvents(container) {
  if (!container) return;

  // Event delegation for category buttons
  container.addEventListener('click', (e) => {
    const button = e.target.closest('.category-btn');
    if (button) {
      const category = button.getAttribute('data-category');
      if (category && eventHandlers.onCategoryChange) {
        eventHandlers.onCategoryChange(category);
      }
    }
  });
}

// Attach pagination events
export function attachPaginationEvents(container) {
  if (!container) return;

  // Event delegation for pagination buttons
  container.addEventListener('click', (e) => {
    const prevBtn = e.target.closest('#prev-page');
    const nextBtn = e.target.closest('#next-page');

    if (prevBtn && !prevBtn.disabled && eventHandlers.onPreviousPage) {
      eventHandlers.onPreviousPage();
    } else if (nextBtn && !nextBtn.disabled && eventHandlers.onNextPage) {
      eventHandlers.onNextPage();
    }
  });
}

// Attach article-related events (bookmarks, delete)
export function attachArticleEvents(container) {
  if (!container) return;

  // Event delegation for bookmark and delete buttons
  container.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    const deleteBtn = e.target.closest('.btn-delete');
    
    if (bookmarkBtn) {
      const articleUrl = bookmarkBtn.getAttribute('data-article-url');
      const articleId = bookmarkBtn.getAttribute('data-article-id');
      const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
      
      if (articleUrl && eventHandlers.onBookmarkToggle) {
        eventHandlers.onBookmarkToggle(articleUrl, articleId, isBookmarked);
      }
    } else if (deleteBtn) {
      const articleId = deleteBtn.getAttribute('data-article-id');
      
      if (articleId && eventHandlers.onBookmarkDelete) {
        eventHandlers.onBookmarkDelete(articleId);
      }
    }
  });
}
