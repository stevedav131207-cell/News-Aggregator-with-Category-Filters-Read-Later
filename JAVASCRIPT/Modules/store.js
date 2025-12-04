// store.js - Application state management and persistent storage

// Initial state structure
let state = {
  articles: [],
  currentPage: 1,
  totalPages: 0,
  activeCategory: 'general',
  searchQuery: '',
  bookmarks: [],
  currentView: 'articles'
};

// Subscribers for state changes
const subscribers = [];

// Storage keys
const BOOKMARKS_KEY = 'news_bookmarks';

// Get current application state
export function getState() {
  return { ...state };
}

// Update application state with new values
export function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

// Subscribe to state changes - returns unsubscribe function
export function subscribe(listener) {
  subscribers.push(listener);
  return () => subscribers.splice(subscribers.indexOf(listener), 1);
}

// Notify all subscribers of state changes
function notifySubscribers() {
  subscribers.forEach(listener => listener(state));
}

// Generate unique ID for an article from its URL
export function generateArticleId(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Create a new bookmark (CRUD - Create)
export function createBookmark(article) {
  try {
    const bookmarks = getBookmarks();
    const articleId = generateArticleId(article.url);
    
    const exists = bookmarks.find(b => b.id === articleId);
    if (exists) return exists;

    const bookmark = {
      id: articleId,
      article: article,
      savedAt: Date.now()
    };

    bookmarks.push(bookmark);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    setState({ bookmarks });
    
    return bookmark;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return null;
  }
}

// Delete a bookmark (CRUD - Delete) - returns deleted bookmark or false
export function deleteBookmark(articleId) {
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.findIndex(b => b.id === articleId);
    
    if (index === -1) return false;

    const removed = bookmarks.splice(index, 1)[0];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    setState({ bookmarks });
    
    return removed;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
}

// Get all bookmarks
export function getBookmarks() {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (!stored) return [];

    const bookmarks = JSON.parse(stored);
    
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

// Initialize store with bookmarks from storage
export function initializeStore() {
  const bookmarks = getBookmarks();
  setState({ bookmarks });
}
