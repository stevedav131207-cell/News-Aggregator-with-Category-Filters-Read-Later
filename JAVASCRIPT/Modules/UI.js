// UI.js - DOM manipulation and rendering

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

/**
 * Create article card element
 * @param {Object} article - Article object
 * @param {boolean} isBookmarked - Whether article is bookmarked
 * @returns {HTMLElement} Article card element
 */
function createArticleCard(article, isBookmarked = false) {
  const card = document.createElement('article');
  card.className = 'article-card';
  card.setAttribute('data-article-id', article.id);

  // Article image
  const imageHtml = article.urlToImage 
    ? `<img src="${article.urlToImage}" alt="${article.title}" class="article-image" loading="lazy">`
    : `<div class="article-image" style="background-color: var(--color-bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">No image available</div>`;

  card.innerHTML = `
    ${imageHtml}
    <div class="article-content">
      <div class="article-meta">
        <span class="article-source">${article.source.name}</span>
        <time class="article-date" datetime="${article.publishedAt}">
          ${formatDate(article.publishedAt)}
        </time>
      </div>
      <h2 class="article-title">${article.title}</h2>
      <p class="article-description">${article.description}</p>
      <div class="article-actions">
        <a 
          href="${article.url}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="article-link"
          aria-label="Read full article: ${article.title}"
        >
          Read More
        </a>
        <button 
          class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
          data-article-id="${article.id}"
          aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark article'}"
          aria-pressed="${isBookmarked}"
        >
          ${isBookmarked ? '★' : '☆'}
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Render articles to container
 * @param {Array} articles - Array of article objects
 * @param {HTMLElement} container - Container element
 * @param {Array} bookmarks - Array of bookmarked article IDs
 */
export function renderArticles(articles, container, bookmarks = []) {
  if (!container) return;

  // Clear container
  container.innerHTML = '';

  if (!articles || articles.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-2xl); color: var(--color-text-secondary);">
        <p style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">No articles found</p>
        <p>Try adjusting your search or category filter</p>
      </div>
    `;
    return;
  }

  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();
  const bookmarkIds = bookmarks.map(b => b.id);

  articles.forEach(article => {
    const isBookmarked = bookmarkIds.includes(article.id);
    const card = createArticleCard(article, isBookmarked);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/**
 * Render pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {HTMLElement} container - Container element
 */
export function renderPagination(currentPage, totalPages, container) {
  if (!container) return;

  // Hide pagination if only one page or no pages
  if (totalPages <= 1) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  container.innerHTML = `
    <button 
      class="pagination-btn" 
      id="prev-page"
      ${prevDisabled ? 'disabled' : ''}
      aria-label="Go to previous page"
    >
      ← Previous
    </button>
    <span class="pagination-info" role="status" aria-live="polite">
      Page ${currentPage} of ${totalPages}
    </span>
    <button 
      class="pagination-btn" 
      id="next-page"
      ${nextDisabled ? 'disabled' : ''}
      aria-label="Go to next page"
    >
      Next →
    </button>
  `;
}

/**
 * Render category filters
 * @param {Array} categories - Array of category objects
 * @param {string} activeCategory - Currently active category
 * @param {HTMLElement} container - Container element
 */
export function renderCategoryFilters(categories, activeCategory, container) {
  if (!container) return;

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-btn ${category.value === activeCategory ? 'active' : ''}`;
    button.setAttribute('data-category', category.value);
    button.setAttribute('aria-pressed', category.value === activeCategory);
    button.textContent = category.label;
    
    if (category.value === activeCategory) {
      button.setAttribute('aria-current', 'true');
    }

    fragment.appendChild(button);
  });

  container.appendChild(fragment);
}

