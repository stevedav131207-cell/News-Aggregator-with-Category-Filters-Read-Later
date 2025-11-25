/**
 * Main application JavaScript for SAMACHAR
 */

// Bookmark functionality
function bookmarkArticle(button, title, description, url, imageUrl, source, category, publishedAt) {
    // Disable button during request
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    // Clean up parameters
    const cleanTitle = title || 'Untitled';
    const cleanDescription = description || '';
    const cleanUrl = url || '';
    const cleanImageUrl = imageUrl || '';
    const cleanSource = source || 'Unknown';
    const cleanCategory = category || 'general';
    const cleanPublishedAt = publishedAt || new Date().toISOString();
    
    console.log('Bookmarking article:', {
        title: cleanTitle,
        url: cleanUrl,
        source: cleanSource
    });
    
    fetch('/bookmarks/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: new URLSearchParams({
            'title': cleanTitle,
            'description': cleanDescription,
            'url': cleanUrl,
            'image_url': cleanImageUrl,
            'source': cleanSource,
            'category': cleanCategory,
            'published_at': cleanPublishedAt
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.status === 'success' || data.status === 'info') {
            button.classList.add('bookmarked');
            button.innerHTML = '<i class="bi bi-bookmark-fill"></i>';
            
            // Add to offline cache
            if (window.offlineManager) {
                window.offlineManager.addBookmarkToCache({
                    id: data.bookmark_id,
                    title: cleanTitle,
                    description: cleanDescription,
                    url: cleanUrl,
                    image_url: cleanImageUrl,
                    source: cleanSource,
                    category: cleanCategory,
                    published_at: cleanPublishedAt,
                    note: ''
                });
            }
            
            showToast(data.message, data.status === 'success' ? 'success' : 'info');
        } else {
            button.innerHTML = originalContent;
            button.disabled = false;
            showToast(data.message || 'Failed to bookmark article', 'warning');
        }
    })
    .catch(error => {
        console.error('Bookmark error:', error);
        button.innerHTML = originalContent;
        button.disabled = false;
        showToast('Failed to bookmark article. Please try again.', 'danger');
    });
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 150);
    }, 3000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    document.body.appendChild(container);
    return container;
}

// Category filter handling
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for category changes
    const categoryLinks = document.querySelectorAll('.category-pills .nav-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading indicator
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.opacity = '0.6';
                mainContent.style.pointerEvents = 'none';
            }
        });
    });
    
    // Search form enhancement
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="q"]');
            if (!searchInput.value.trim()) {
                e.preventDefault();
                showToast('Please enter a search term', 'warning');
            }
        });
    }
    
    // Image lazy loading fallback
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Confirm delete actions
    const deleteButtons = document.querySelectorAll('form[action*="delete"]');
    deleteButtons.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this bookmark?')) {
                e.preventDefault();
            }
        });
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-dismissible)');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// Handle network status changes
window.addEventListener('load', function() {
    updateOnlineStatus();
});

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const condition = navigator.onLine ? 'online' : 'offline';
    console.log('Network status:', condition);
    
    if (condition === 'offline') {
        showToast('You are offline. Some features may be limited.', 'warning');
    }
}

// Service Worker registration (optional, for advanced offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/static/js/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed:', err));
    });
}
