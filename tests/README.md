# SAMACHAR Tests

This directory contains all test files and verification scripts for the SAMACHAR project.

## 🧪 Test Files

### API Tests
- **test_all_apis.py** - Test all 7 news API connections
- **test_newsapi.py** - Test NewsAPI.org specifically
- **quick_api_test.py** - Quick API connection test

### Module Tests
- **test_all_modules.py** - Test all Django modules
- **test_bookmark.py** - Test bookmark functionality

### Verification
- **verify_setup.py** - Verify complete installation and setup

## 🚀 Running Tests

### Test All APIs
```bash
cd ..
python3 tests/test_all_apis.py
```

**Output:**
- Shows which APIs are working
- Displays sample articles from each API
- Reports total working APIs

### Test NewsAPI
```bash
cd ..
python3 tests/test_newsapi.py
```

**Output:**
- Tests NewsAPI.org connection
- Shows fetched articles
- Reports success/failure

### Test Bookmarks
```bash
cd ..
python3 tests/test_bookmark.py
```

**Output:**
- Tests bookmark CRUD operations
- Verifies database operations
- Reports test results

### Test All Modules
```bash
cd ..
python3 tests/test_all_modules.py
```

**Output:**
- Tests all Django apps
- Verifies imports
- Reports module status

### Verify Setup
```bash
cd ..
python3 tests/verify_setup.py
```

**Output:**
- Checks dependencies
- Verifies configuration
- Tests database connection
- Reports overall status

## 📊 Test Results

### Expected Results

**test_all_apis.py:**
```
✅ NewsAPI: 5 articles fetched
✅ Guardian: 5 articles fetched
✅ MediaStack: 5 articles fetched
✅ NewsData: 5 articles fetched
⚠️ NYT: Not configured
⚠️ Currents: Not configured
❌ GNews: 403 Forbidden

Working APIs: 4/7
```

**test_bookmark.py:**
```
✅ All bookmark tests passed
✅ Create, read, update, delete working
✅ Database operations successful
```

**verify_setup.py:**
```
✅ Dependencies installed
✅ Database configured
✅ API keys present
✅ Setup complete
```

## 🔧 Troubleshooting

### Tests Fail
1. Check if server is running (stop it for tests)
2. Verify .env file has API keys
3. Check internet connection
4. Review error messages

### Import Errors
```bash
cd ..
pip3 install -r requirements.txt
```

### Database Errors
```bash
cd ..
python3 manage.py migrate
```

### API Errors
- Check API keys in .env
- Verify API service status
- Check rate limits

## 📝 Adding New Tests

### Create New Test File
```python
# tests/test_new_feature.py
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'samachar.settings')
django.setup()

# Your test code here
def test_feature():
    # Test implementation
    pass

if __name__ == '__main__':
    test_feature()
```

### Run New Test
```bash
cd ..
python3 tests/test_new_feature.py
```

## 🎯 Test Coverage

### Current Coverage
- ✅ API connections (7 APIs)
- ✅ Bookmark CRUD operations
- ✅ Module imports
- ✅ Setup verification
- ✅ Database operations

### Future Tests
- [ ] User authentication
- [ ] Search functionality
- [ ] Category filtering
- [ ] Offline support
- [ ] UI components

## 📚 Related Documentation

- **Setup Guide**: [docs/QUICKSTART.md](../docs/QUICKSTART.md)
- **API Setup**: [docs/MULTI_API_SETUP.md](../docs/MULTI_API_SETUP.md)
- **API Status**: [docs/API_STATUS_REPORT.md](../docs/API_STATUS_REPORT.md)

## 🔄 Continuous Testing

### Before Committing
```bash
cd ..
python3 tests/test_all_modules.py
python3 tests/test_bookmark.py
```

### Before Deploying
```bash
cd ..
python3 tests/verify_setup.py
python3 tests/test_all_apis.py
python3 manage.py check
```

### Regular Checks
```bash
cd ..
python3 tests/test_all_apis.py  # Check API status
```

## ⚡ Quick Test Commands

```bash
# From project root
python3 tests/test_all_apis.py      # Test APIs
python3 tests/test_bookmark.py      # Test bookmarks
python3 tests/verify_setup.py       # Verify setup
python3 tests/test_all_modules.py   # Test modules
```

---

**Last Updated:** November 25, 2025  
**Test Status:** ✅ All tests passing

**Navigate back to:** [Main README](../README.md)
