// EVENTS.js - Event handling and user interactions

// Event handlers storage
let eventHandlers = {};

/**
 * Create debounced function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Initialize all event listeners
 * @param {Object} handlers - Object containing event handler functions
 */
export function initializeEventListeners(handlers) {
  eventHandlers = handlers;

  // Attach search events
  const searchInput = document.getElementById('search');
  if (searchInput) {
    attachSearchEvents(searchInput);
  }

  // Attach category events
  const categoryContainer = document.getElementById('category-filters');
  if (categoryContainer) {
    attachCategoryEvents(categoryContainer);
  }

  // Attach sort events
  const sortContainer = document.getElementById('sort-controls');
  if (sortContainer) {
    attachSortEvents(sortContainer);
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

    // Keyboard support
    bookmarksBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (eventHandlers.onViewBookmarks) {
          eventHandlers.onViewBookmarks();
        }
      }
    });
  }

  // Attach article events (using delegation on articles container)
  const articlesContainer = document.getElementById('articles');
  if (articlesContainer) {
    attachArticleEvents(articlesContainer);
  }
}

/**
 * Attach search events with debouncing
 * @param {HTMLElement} searchInput - Search input element
 */
export function attachSearchEvents(searchInput) {
  if (!searchInput) return;

  // Debounced search handler (500ms)
  const debouncedSearch = debounce((query) => {
    if (eventHandlers.onSearch) {
      eventHandlers.onSearch(query);
    }
  }, 500);

  // Input event for search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // If query is empty, restore previous state immediately
    if (query === '') {
      if (eventHandlers.onSearchClear) {
        eventHandlers.onSearchClear();
      }
    } else {
      debouncedSearch(query);
    }
  });

  // Keyboard support
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      if (eventHandlers.onSearchClear) {
        eventHandlers.onSearchClear();
      }
    }
  });
}

/**
 * Attach category filter events
 * @param {HTMLElement} container - Category filters container
 */
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

  // Keyboard support
  container.addEventListener('keydown', (e) => {
    const button = e.target.closest('.category-btn');
    if (button && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const category = button.getAttribute('data-category');
      if (category && eventHandlers.onCategoryChange) {
        eventHandlers.onCategoryChange(category);
      }
    }
  });

  // Arrow key navigation
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const buttons = Array.from(container.querySelectorAll('.category-btn'));
      const currentIndex = buttons.indexOf(document.activeElement);
      
      if (currentIndex !== -1) {
        e.preventDefault();
        let nextIndex;
        
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        } else {
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        }
        
        buttons[nextIndex].focus();
      }
    }
  });
}

/**
 * Attach pagination events
 * @param {HTMLElement} container - Pagination container
 */
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

  // Keyboard support
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const prevBtn = e.target.closest('#prev-page');
      const nextBtn = e.target.closest('#next-page');

      if (prevBtn && !prevBtn.disabled && eventHandlers.onPreviousPage) {
        e.preventDefault();
        eventHandlers.onPreviousPage();
      } else if (nextBtn && !nextBtn.disabled && eventHandlers.onNextPage) {
        e.preventDefault();
        eventHandlers.onNextPage();
      }
    }
  });
}

/**
 * Attach sort control events
 * @param {HTMLElement} container - Sort controls container
 */
export function attachSortEvents(container) {
  if (!container) return;

  // Event delegation for sort buttons
  container.addEventListener('click', (e) => {
    const button = e.target.closest('.sort-btn');
    if (button) {
      const sortBy = button.getAttribute('data-sort');
      if (sortBy && eventHandlers.onSortChange) {
        eventHandlers.onSortChange(sortBy);
      }
    }
  });

  // Keyboard support
  container.addEventListener('keydown', (e) => {
    const button = e.target.closest('.sort-btn');
    if (button && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const sortBy = button.getAttribute('data-sort');
      if (sortBy && eventHandlers.onSortChange) {
        eventHandlers.onSortChange(sortBy);
      }
    }
  });
}

/**
 * Attach article-related events (bookmarks)
 * @param {HTMLElement} container - Articles container
 */
export function attachArticleEvents(container) {
  if (!container) return;

  // Event delegation for bookmark buttons
  container.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      const articleId = bookmarkBtn.getAttribute('data-article-id');
      const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
      
      if (articleId && eventHandlers.onBookmarkToggle) {
        eventHandlers.onBookmarkToggle(articleId, isBookmarked);
      }
    }
  });

  // Keyboard support for bookmark buttons
  container.addEventListener('keydown', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const articleId = bookmarkBtn.getAttribute('data-article-id');
      const isBookmarked = bookmarkBtn.classList.contains('bookmarked');
      
      if (articleId && eventHandlers.onBookmarkToggle) {
        eventHandlers.onBookmarkToggle(articleId, isBookmarked);
      }
    }
  });

  // Touch event support for mobile
  container.addEventListener('touchstart', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      // Touch events are handled by click event
      // This just ensures touch feedback
      bookmarkBtn.style.transform = 'scale(0.95)';
    }
  });

  container.addEventListener('touchend', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.style.transform = '';
    }
  });
}

/**
 * Attach bookmark-specific events
 * @param {HTMLElement} container - Bookmarks container
 */
export function attachBookmarkEvents(container) {
  if (!container) return;

  // Reuse article events for bookmark view
  attachArticleEvents(container);
}