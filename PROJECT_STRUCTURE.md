# SAMACHAR Project Structure

## 📁 Complete Directory Layout

```
samachar/
│
├── 📂 accounts/                    # User authentication app
│   ├── __init__.py
│   ├── admin.py                   # Admin configuration
│   ├── apps.py                    # App configuration
│   ├── forms.py                   # User registration form
│   ├── models.py                  # User models (uses Django default)
│   ├── tests.py                   # Unit tests
│   ├── urls.py                    # Auth URL patterns
│   ├── views.py                   # Login, register, logout views
│   ├── 📂 migrations/             # Database migrations
│   └── 📂 templates/accounts/     # Auth templates
│       ├── login.html
│       └── register.html
│
├── 📂 bookmarks/                   # Bookmark management app
│   ├── __init__.py
│   ├── admin.py                   # Admin configuration
│   ├── apps.py                    # App configuration
│   ├── models.py                  # Bookmark model
│   ├── tests.py                   # Unit tests
│   ├── urls.py                    # Bookmark URL patterns
│   ├── views.py                   # CRUD operations
│   ├── 📂 migrations/             # Database migrations
│   └── 📂 templates/bookmarks/    # Bookmark templates
│       ├── list.html              # Bookmark list view
│       └── edit.html              # Edit bookmark view
│
├── 📂 news/                        # News aggregation app
│   ├── __init__.py
│   ├── admin.py                   # Admin configuration
│   ├── apps.py                    # App configuration
│   ├── models.py                  # News models (if any)
│   ├── tests.py                   # Unit tests
│   ├── urls.py                    # News URL patterns
│   ├── views.py                   # Dashboard and search views
│   ├── news_api_client.py         # Legacy API client
│   ├── 📂 api_clients/            # Multi-API client system
│   │   ├── __init__.py
│   │   ├── base_client.py         # Base API client class
│   │   ├── newsapi_client.py      # NewsAPI.org client
│   │   ├── guardian_client.py     # Guardian API client
│   │   ├── nyt_client.py          # NYT API client
│   │   ├── currents_client.py     # Currents API client
│   │   ├── gnews_client.py        # GNews client
│   │   ├── mediastack_client.py   # MediaStack client
│   │   ├── newsdata_client.py     # NewsData client
│   │   └── aggregator.py          # Main aggregator
│   ├── 📂 migrations/             # Database migrations
│   └── 📂 templates/news/         # News templates
│       ├── dashboard.html         # Main dashboard
│       └── search_results.html    # Search results page
│
├── 📂 samachar/                    # Project settings
│   ├── __init__.py
│   ├── asgi.py                    # ASGI configuration
│   ├── settings.py                # Django settings
│   ├── urls.py                    # Root URL configuration
│   └── wsgi.py                    # WSGI configuration
│
├── 📂 templates/                   # Shared templates
│   └── base.html                  # Base template (navbar, slider, styles)
│
├── 📂 static/                      # Static files
│   ├── 📂 js/
│   │   ├── app.js                 # Main application JavaScript
│   │   └── offline.js             # Offline detection and caching
│   ├── 📂 css/                    # Custom CSS (in base.html)
│   └── 📂 images/                 # Images and icons
│
├── 📂 docs/                        # 📚 Documentation
│   ├── README.md                  # Documentation index
│   ├── SUMMARY.md                 # Comprehensive project overview
│   ├── QUICKSTART.md              # 5-minute setup guide
│   ├── FEATURES.md                # Complete feature list
│   ├── MULTI_API_SETUP.md         # API configuration guide
│   ├── API_STATUS_REPORT.md       # Current API status
│   ├── ADMIN_CREDENTIALS.md       # Admin panel guide
│   └── DEPLOYMENT.md              # Production deployment
│
├── 📂 tests/                       # 🧪 Test files
│   ├── README.md                  # Testing guide
│   ├── test_all_apis.py           # Test all APIs
│   ├── test_newsapi.py            # Test NewsAPI
│   ├── test_bookmark.py           # Test bookmarks
│   ├── test_all_modules.py        # Test modules
│   ├── quick_api_test.py          # Quick API test
│   └── verify_setup.py            # Verify installation
│
├── 📂 scripts/                     # 📜 Utility scripts
│   ├── README.md                  # Scripts guide
│   ├── start.sh                   # Quick start script
│   ├── start_with_checks.sh       # Start with checks
│   └── test_api_now.sh            # Test APIs
│
├── 📂 .kiro/                       # Kiro IDE configuration
│   ├── 📂 specs/                  # Spec-driven development
│   │   └── 📂 samachar-news-aggregator/
│   │       ├── requirements.md    # EARS requirements
│   │       ├── design.md          # Design document
│   │       └── tasks.md           # Implementation tasks
│   └── 📂 steering/               # Kiro steering files
│
├── 📂 .vscode/                     # VS Code configuration
│   └── settings.json
│
├── 📄 .env                         # 🔐 Environment variables (API keys)
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 db.sqlite3                   # 💾 SQLite database
├── 📄 manage.py                    # Django management script
├── 📄 requirements.txt             # Python dependencies
├── 📄 samachar.log                 # Application logs
├── 📄 README.md                    # Main project README
└── 📄 PROJECT_STRUCTURE.md         # This file
```

---

## 📂 Directory Descriptions

### Core Django Apps

#### `accounts/`
**Purpose:** User authentication and authorization
- User registration with validation
- Login/logout functionality
- Password management
- Session handling

#### `bookmarks/`
**Purpose:** Bookmark management system
- CRUD operations for bookmarks
- Personal notes on articles
- User-scoped data
- Offline caching support

#### `news/`
**Purpose:** News aggregation and display
- Multi-API integration
- Category filtering
- Search functionality
- Article display

#### `samachar/`
**Purpose:** Project configuration
- Django settings
- URL routing
- WSGI/ASGI configuration
- Environment setup

---

### Frontend Assets

#### `templates/`
**Purpose:** Shared HTML templates
- `base.html` - Base template with navbar, slider, and global styles
- Inherited by all other templates
- Contains CSS and JavaScript

#### `static/`
**Purpose:** Static files (CSS, JS, images)
- `js/app.js` - Main application logic
- `js/offline.js` - Offline support
- Custom CSS in base.html
- Images and icons

---

### Documentation

#### `docs/`
**Purpose:** All project documentation
- Setup guides
- Feature documentation
- API configuration
- Admin guides
- Deployment instructions

**Key Files:**
- `SUMMARY.md` - Complete project overview
- `QUICKSTART.md` - Fast setup guide
- `ADMIN_CREDENTIALS.md` - Admin access

---

### Testing

#### `tests/`
**Purpose:** Test files and verification scripts
- API connection tests
- Module tests
- Bookmark functionality tests
- Setup verification

**Key Files:**
- `test_all_apis.py` - Test all 7 APIs
- `test_bookmark.py` - Test CRUD operations
- `verify_setup.py` - Verify installation

---

### Scripts

#### `scripts/`
**Purpose:** Utility scripts for development
- Quick start scripts
- Testing scripts
- Setup automation

**Key Files:**
- `start.sh` - Quick development start
- `start_with_checks.sh` - Start with verification
- `test_api_now.sh` - Quick API test

---

## 🔑 Important Files

### Configuration Files

#### `.env`
**Purpose:** Environment variables (API keys, secrets)
**Contains:**
- `NEWS_API_KEY` - NewsAPI.org key
- `GUARDIAN_API_KEY` - Guardian API key
- `NYT_API_KEY` - New York Times key
- `CURRENTS_API_KEY` - Currents API key
- `GNEWS_API_KEY` - GNews key
- `MEDIASTACK_API_KEY` - MediaStack key
- `NEWSDATA_API_KEY` - NewsData key
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode flag

**⚠️ Never commit to Git!**

#### `requirements.txt`
**Purpose:** Python dependencies
**Contains:**
- Django 5.2.8
- requests
- python-dotenv
- Other dependencies

#### `.gitignore`
**Purpose:** Files to exclude from Git
**Excludes:**
- `.env` (secrets)
- `db.sqlite3` (database)
- `__pycache__/` (Python cache)
- `*.pyc` (compiled Python)
- `samachar.log` (logs)

---

### Database

#### `db.sqlite3`
**Purpose:** SQLite database file
**Contains:**
- User accounts
- Bookmarks
- Sessions
- Django admin data

**⚠️ Backup regularly!**

---

### Management

#### `manage.py`
**Purpose:** Django management script
**Usage:**
```bash
python3 manage.py runserver      # Start server
python3 manage.py migrate        # Run migrations
python3 manage.py createsuperuser # Create admin
python3 manage.py check          # Check for issues
```

---

## 📊 File Statistics

### Code Files
- **Python files**: 25+
- **HTML templates**: 8
- **JavaScript files**: 2
- **Total lines of code**: 2,500+

### Documentation
- **Documentation files**: 8
- **README files**: 4
- **Total documentation**: 3,000+ lines

### Tests
- **Test files**: 6
- **Test coverage**: Core features

### Scripts
- **Shell scripts**: 3
- **Utility scripts**: All executable

---

## 🎯 Key Locations

### For Development
```
news/views.py              # Main view logic
news/api_clients/          # API integration
templates/base.html        # UI and styling
static/js/app.js          # Frontend logic
```

### For Configuration
```
.env                      # API keys and secrets
samachar/settings.py      # Django settings
requirements.txt          # Dependencies
```

### For Documentation
```
docs/SUMMARY.md           # Project overview
docs/QUICKSTART.md        # Setup guide
docs/ADMIN_CREDENTIALS.md # Admin access
```

### For Testing
```
tests/test_all_apis.py    # API tests
tests/verify_setup.py     # Setup verification
scripts/start.sh          # Quick start
```

---

## 🔄 Workflow Paths

### User Request Flow
```
Browser Request
    ↓
samachar/urls.py (routing)
    ↓
news/views.py (view logic)
    ↓
news/api_clients/aggregator.py (fetch news)
    ↓
templates/news/dashboard.html (render)
    ↓
Browser Response
```

### Bookmark Flow
```
User Click (static/js/app.js)
    ↓
AJAX Request
    ↓
bookmarks/views.py (save)
    ↓
bookmarks/models.py (database)
    ↓
Response + Cache (static/js/offline.js)
```

---

## 📝 Notes

### Organization Principles
- **Separation of Concerns**: Each app has specific responsibility
- **Documentation First**: Comprehensive docs in dedicated folder
- **Testing Included**: All tests in dedicated folder
- **Scripts Organized**: Utility scripts in dedicated folder
- **Clean Root**: Minimal files in root directory

### Best Practices
- Keep `.env` secure and never commit
- Backup `db.sqlite3` regularly
- Update documentation when adding features
- Add tests for new functionality
- Use scripts for common tasks

---

**Last Updated:** November 25, 2025  
**Version:** 2.0  
**Status:** ✅ Well Organized

**Navigate to:**
- [Main README](README.md)
- [Documentation](docs/README.md)
- [Tests](tests/README.md)
- [Scripts](scripts/README.md)
