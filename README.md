# Samachar - News Website

A responsive news website built with vanilla JavaScript, HTML, and CSS. Features category filtering, search, pagination, and bookmarks.

## Live Demo

Open `main.html` in your browser or deploy to GitHub Pages.

## Features

- Fetch latest headlines from NewsData.io API
- Debounced search (800ms, min 2 characters)
- Category filtering (General, Business, Technology, Sports, Entertainment, Health, Science)
- Client-side pagination (3 articles per page)
- Bookmark articles with undo support (5 seconds)
- Responsive design (Mobile, Tablet, Desktop)
- Accessibility support (ARIA, keyboard navigation)

## Project Structure

```
samachar/
├── index-simple.html       # Standalone version (recommended)
├── index.html              # Modular version (requires Vite)
├── css/
│   └── styles.css          # Styles for index.html
├── js/
    ├── main.js             # App entry point
    └── modules/
        ├── api.js          # NewsData.io API
        ├── ui.js           # DOM rendering
        ├── events.js       # Event handling
        └── store.js        # State & bookmarks
```

## Quick Start

### Option 1: Standalone (Easiest)

1. Open `main.html` in your browser
2. That's it! Works with Live Server too.


## API Configuration

The app uses **NewsData.io API**. The API key is already configured.

To use your own key:

1. Get a free key from [newsdata.io](https://newsdata.io/)
2. Update in `index-simple.html` (line ~838):
   ```javascript
   const API_KEY = "your_api_key_here";
   ```

## Deployment

### GitHub Pages (Recommended)

1. Push to GitHub
2. Go to repo Settings → Pages
3. Select branch and save
4. Your site is live!

### Netlify

1. Push to GitHub
2. Connect repo to Netlify


## Usage

- **Browse**: View latest news in selected category
- **Filter**: Click category buttons to filter
- **Search**: Type 2+ characters to search (waits 800ms)
- **Bookmark**: Click ☆ to save, ★ to remove
- **View Bookmarks**: Click "Bookmarks" button
- **Navigate**: Use pagination buttons

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- NewsData.io API
- Vite (optional, for build)

## Responsive Breakpoints

- Mobile: < 480px (1 column)
- Tablet: 481px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

## Accessibility

- ARIA roles and labels
- Keyboard navigation (Tab, Enter)
- Skip to main content link
- Focus indicators
- Screen reader friendly

## License

MIT
