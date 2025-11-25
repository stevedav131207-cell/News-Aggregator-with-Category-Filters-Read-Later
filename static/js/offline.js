/**
 * Offline detection and bookmark caching module for SAMACHAR
 */

class OfflineManager {
    constructor() {
        this.STORAGE_KEY = 'samachar_bookmarks';
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Check initial state
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }

    handleOnline() {
        console.log('Connection restored');
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.style.display = 'none';
        }
        
        // Show success message
        this.showMessage('You are back online!', 'success');
    }

    handleOffline() {
        console.log('Connection lost');
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.style.display = 'block';
        }
        
        // Load cached bookmarks if on dashboard
        if (window.location.pathname === '/') {
            this.loadCachedBookmarks();
        }
    }

    /**
     * Save bookmarks to localStorage
     */
    saveBookmarks(bookmarks) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
            console.log(`Saved ${bookmarks.length} bookmarks to cache`);
        } catch (e) {
            console.error('Failed to save bookmarks to cache:', e);
        }
    }

    /**
     * Get bookmarks from localStorage
     */
    getBookmarks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load bookmarks from cache:', e);
            return [];
        }
    }

    /**
     * Add a bookmark to cache
     */
    addBookmarkToCache(bookmark) {
        const bookmarks = this.getBookmarks();
        
        // Check if bookmark already exists
        const exists = bookmarks.some(b => b.url === bookmark.url);
        if (!exists) {
            bookmarks.unshift(bookmark);
            this.saveBookmarks(bookmarks);
        }
    }

    /**
     * Remove a bookmark from cache
     */
    removeBookmarkFromCache(bookmarkId) {
        const bookmarks = this.getBookmarks();
        const filtered = bookmarks.filter(b => b.id !== bookmarkId);
        this.saveBookmarks(filtered);
    }

    /**
     * Update a bookmark in cache
     */
    updateBookmarkInCache(bookmarkId, updates) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => b.id === bookmarkId);
        
        if (index !== -1) {
            bookmarks[index] = { ...bookmarks[index], ...updates };
            this.saveBookmarks(bookmarks);
        }
    }

    /**
     * Load cached bookmarks and display them
     */
    loadCachedBookmarks() {
        const bookmarks = this.getBookmarks();
        
        if (bookmarks.length === 0) {
            return;
        }

        // Find the articles container
        const container = document.querySelector('.row.row-cols-1');
        if (!container) {
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Add cached bookmarks
        bookmarks.forEach(bookmark => {
            const card = this.createBookmarkCard(bookmark);
            container.appendChild(card);
        });

        // Update heading
        const heading = document.querySelector('h2');
        if (heading) {
            heading.textContent = 'Your Saved Bookmarks (Offline)';
        }
    }

    /**
     * Create a card element for a bookmark
     */
    createBookmarkCard(bookmark) {
        const col = document.createElement('div');
        col.className = 'col';

        const imageUrl = bookmark.image_url || '/static/images/placeholder.svg';
        const publishedDate = new Date(bookmark.published_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        col.innerHTML = `
            <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${this.escapeHtml(bookmark.title)}" 
                     onerror="this.src='/static/images/placeholder.svg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${this.escapeHtml(bookmark.title)}</h5>
                    <p class="card-text">${this.escapeHtml(this.truncate(bookmark.description, 20))}</p>
                    ${bookmark.note ? `
                        <div class="alert alert-info py-2 px-3 mb-2">
                            <small><strong>Note:</strong> ${this.escapeHtml(bookmark.note)}</small>
                        </div>
                    ` : ''}
                    <div class="mt-auto">
                        <p class="card-text">
                            <small class="text-muted">
                                <strong>${this.escapeHtml(bookmark.source)}</strong><br>
                                ${publishedDate}<br>
                                <span class="badge bg-secondary">${this.escapeHtml(bookmark.category)}</span>
                            </small>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="${bookmark.url}" target="_blank" class="btn btn-sm btn-primary">Read more</a>
                            <span class="badge bg-warning text-dark">Cached</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Truncate text to word limit
     */
    truncate(text, wordLimit) {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    /**
     * Show a temporary message
     */
    showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }
}

// Initialize offline manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.offlineManager = new OfflineManager();
});
