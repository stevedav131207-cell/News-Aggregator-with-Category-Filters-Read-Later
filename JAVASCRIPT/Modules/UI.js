// ui.js - DOM manipulation and rendering

// Format date to readable string
function formatDate(dateString) {
  const diffDays = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Create article card element with staggered animation
function createArticleCard(article, isBookmarked = false, isBookmarkView = false, index = 0) {
  const imageHtml = article.urlToImage 
    ? `<img src="${article.urlToImage}" alt="${article.title}" class="article-image" loading="lazy" decoding="async">`
    : '<div class="article-image" style="background: #fee2e2; display: flex; align-items: center; justify-content: center; color: #dc2626; font-weight: 600; font-size: 1rem;" role="img" aria-label="No image available">No Image</div>';

  const deleteButton = isBookmarkView ? `
    <div class="bookmark-menu">
      <button class="btn-delete" data-article-id="${article.id}" title="Delete bookmark" aria-label="Delete ${article.title} from bookmarks" tabindex="0">
        <span aria-hidden="true">🗑️</span>
      </button>
    </div>
  ` : '';

  const bookmarkButton = !isBookmarkView ? `
    <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-article-url="${article.url}" data-article-id="${article.id}" aria-label="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}" aria-pressed="${isBookmarked}" tabindex="0">
      <span aria-hidden="true">${isBookmarked ? '★' : '☆'}</span>
    </button>
  ` : '';

  return `
    <article class="article-card ${isBookmarkView ? 'bookmark-card' : ''}" data-article-id="${article.id}" style="animation-delay: ${index * 0.05}s">
      ${deleteButton}
      ${imageHtml}
      <div class="article-content">
        <div class="article-meta">
          <span class="article-source">${article.source.name}</span>
          <time class="article-date" datetime="${article.publishedAt}">${formatDate(article.publishedAt)}</time>
        </div>
        <h2 class="article-title">${article.title}</h2>
        <p class="article-description">${article.description || 'No description available'}</p>
        <div class="article-actions">
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-link" aria-label="Read full article: ${article.title}">Read More</a>
          ${bookmarkButton}
        </div>
      </div>
    </article>
  `;
}

// Render articles to container
export function renderArticles(articles, container, bookmarks = [], isBookmarkView = false, headerHtml = '') {
  if (!container) return;

  if (!articles || articles.length === 0) {
    const message = isBookmarkView 
      ? '<p style="font-size: 1.125rem; margin-bottom: 1rem;">No bookmarks yet</p><p>Bookmark articles to read them later</p>'
      : '<p>No articles found</p>';
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;" role="status">${message}</div>`;
    return;
  }

  const bookmarkIds = bookmarks.map(b => b.id);
  const articlesHTML = articles.map((article, index) => {
    const isBookmarked = bookmarkIds.includes(article.id);
    return createArticleCard(article, isBookmarked, isBookmarkView, index);
  }).join('');

  container.innerHTML = headerHtml + articlesHTML;
}

// Render pagination controls
export function renderPagination(currentPage, totalPages, container) {
  if (!container) return;

  if (totalPages <= 1) {
    container.style.display = 'none';
    container.setAttribute('aria-hidden', 'true');
    return;
  }

  container.style.display = 'flex';
  container.setAttribute('aria-hidden', 'false');
  container.innerHTML = `
    <button class="pagination-btn" id="prev-page" ${currentPage === 1 ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'} aria-label="Go to previous page" tabindex="0">
      <span aria-hidden="true">←</span> Previous
    </button>
    <span class="pagination-info" role="status" aria-live="polite" aria-atomic="true">Page ${currentPage} of ${totalPages}</span>
    <button class="pagination-btn" id="next-page" ${currentPage === totalPages ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'} aria-label="Go to next page" tabindex="0">
      Next <span aria-hidden="true">→</span>
    </button>
  `;
}

// Render category filters
export function renderCategoryFilters(categories, activeCategory, container) {
  if (!container) return;

  container.innerHTML = categories.map(cat => 
    `<button class="category-btn ${cat.value === activeCategory ? 'active' : ''}" data-category="${cat.value}" aria-label="Filter by ${cat.label} news" aria-pressed="${cat.value === activeCategory}" tabindex="0">${cat.label}</button>`
  ).join('');
}

// Toggle element visibility
function toggleVisibility(container, show, content = null) {
  if (!container) return;
  container.style.display = show ? 'block' : 'none';
  container.setAttribute('aria-hidden', String(!show));
  if (content !== null) container.innerHTML = content;
}

// Show/hide error message
export const showError = (message, container) => toggleVisibility(container, true, `<p>${message}</p>`);
export const hideError = (container) => toggleVisibility(container, false, '');

// Show/hide loading indicator
export const showLoading = (container) => toggleVisibility(container, true);
export const hideLoading = (container) => toggleVisibility(container, false);

// Update bookmark button state
export function updateBookmarkButton(articleId, isBookmarked) {
  const button = document.querySelector(`.bookmark-btn[data-article-id="${articleId}"]`);
  if (!button) return;

  button.classList.toggle('bookmarked', isBookmarked);
  button.textContent = isBookmarked ? '★' : '☆';
}

// Show toast notification
export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Undo timeout tracker
let undoTimeout = null;

// Show undo notification with callback
export function showUndoNotification(message, onUndo) {
  const notification = document.getElementById('undo-notification');
  const messageEl = document.getElementById('undo-message');
  const undoBtn = document.getElementById('undo-btn');
  
  if (!notification || !messageEl || !undoBtn) return;

  messageEl.textContent = message;
  notification.classList.add('active');

  // Clear previous timeout
  if (undoTimeout) {
    clearTimeout(undoTimeout);
  }

  // Remove old event listener
  const newUndoBtn = undoBtn.cloneNode(true);
  undoBtn.parentNode.replaceChild(newUndoBtn, undoBtn);

  // Add new event listener
  newUndoBtn.addEventListener('click', () => {
    onUndo();
    hideUndoNotification();
  });

  // Auto-hide after 5 seconds
  undoTimeout = setTimeout(() => {
    hideUndoNotification();
  }, 5000);
}

// Hide undo notification (internal use only)
function hideUndoNotification() {
  const notification = document.getElementById('undo-notification');
  if (!notification) return;

  notification.classList.remove('active');
  if (undoTimeout) {
    clearTimeout(undoTimeout);
    undoTimeout = null;
  }
}
