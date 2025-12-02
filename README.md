# News Website

A modular, accessible, and responsive news website built with vanilla JavaScript, HTML, and CSS. Features include category filtering, search, pagination, sorting, bookmarks, and client-side caching.

## Features

- 📰 Fetch latest headlines from News API
- 🔍 Debounced search functionality
- 📑 Category filtering (Sports, Technology, Business, Entertainment, Health, Science)
- 📄 Pagination with navigation controls
- 🔄 Sort by date or relevance
- 📚 Bookmark articles with undo support
- 💾 Client-side caching with IndexedDB/localStorage
- ♿ Full accessibility support (ARIA, keyboard navigation)
- 📱 Responsive design for all devices
- ⚡ Performance optimized

## Project Structure

```
news-website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles with CSS custom properties
├── js/
│   ├── main.js             # Application entry point
│   └── modules/
│       ├── api.js          # News API communication
│       ├── ui.js           # DOM manipulation and rendering
│       ├── events.js       # Event handling
│       └── store.js        # State management and storage
├── tests/
│   └── setup.js            # Test configuration
├── package.json
├── vitest.config.js
└── README.md
```

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- News API key (get one at https://newsapi.org/)


### Usage

1. **Browse Headlines**: View the latest news in the default "General" category
2. **Filter by Category**: Click category buttons to filter news by topic
3. **Search**: Type in the search box to find specific articles (debounced 500ms)
4. **Sort**: Choose between "Latest" (by date) or "Relevance" sorting
5. **Bookmark**: Click the star icon to save articles for later
6. **View Bookmarks**: Click the "Bookmarks" button to see saved articles
7. **Pagination**: Navigate through multiple pages of results
8. **Undo**: After removing a bookmark, you have 5 seconds to undo

## Architecture

The application follows a modular ES6 architecture with clear separation of concerns:

- **main.js**: Initializes the application and coordinates modules
- **api.js**: Handles all News API communication
- **ui.js**: Manages DOM manipulation and rendering
- **events.js**: Handles user interactions and event delegation
- **store.js**: Manages application state and persistent storage

## Accessibility

- ARIA roles and labels on all interactive elements
- Keyboard navigation support (Tab, Enter, Space, Arrow keys)
- Skip links for quick navigation
- Visible focus indicators
- Screen reader friendly

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Client-side caching with 15-minute TTL
- Debounced search (500ms)
- Lazy loading for images
- Optimized DOM updates
- Request deduplication

## License

MIT
