# SAMACHAR Scripts

This directory contains utility scripts for running and managing the SAMACHAR application.

## 📜 Available Scripts

### start.sh
**Purpose:** Quick start script for development server

**Usage:**
```bash
./scripts/start.sh
```

**What it does:**
- Creates virtual environment (if needed)
- Installs dependencies
- Runs database migrations
- Offers to create superuser
- Starts development server

**When to use:**
- First time setup
- After pulling new changes
- Quick development start

---

### start_with_checks.sh
**Purpose:** Start server with comprehensive checks

**Usage:**
```bash
./scripts/start_with_checks.sh
```

**What it does:**
- Checks Python version
- Verifies dependencies
- Tests database connection
- Checks API keys
- Runs Django checks
- Tests API connections
- Starts development server

**When to use:**
- Troubleshooting issues
- Verifying setup
- Before important work

---

### test_api_now.sh
**Purpose:** Quick API connection test

**Usage:**
```bash
./scripts/test_api_now.sh
```

**What it does:**
- Tests all configured APIs
- Shows which APIs are working
- Displays sample articles
- Reports total working APIs

**When to use:**
- After adding new API keys
- Troubleshooting API issues
- Verifying API status

---

## 🚀 Quick Start Guide

### First Time Setup
```bash
# Make scripts executable (if not already)
chmod +x scripts/*.sh

# Run quick start
./scripts/start.sh
```

### Daily Development
```bash
# Just start the server
./scripts/start.sh
```

### Troubleshooting
```bash
# Run with checks
./scripts/start_with_checks.sh
```

### Check APIs
```bash
# Test API connections
./scripts/test_api_now.sh
```

## 📋 Script Details

### start.sh

**Features:**
- ✅ Virtual environment management
- ✅ Dependency installation
- ✅ Database migrations
- ✅ Superuser creation prompt
- ✅ Development server start

**Output:**
```
🚀 Starting SAMACHAR...
✅ Virtual environment ready
✅ Dependencies installed
✅ Database migrated
✅ Server starting...
```

**Exit Codes:**
- 0: Success
- 1: Error occurred

---

### start_with_checks.sh

**Features:**
- ✅ Python version check
- ✅ Dependency verification
- ✅ Database check
- ✅ API key validation
- ✅ Django system check
- ✅ API connection test
- ✅ Comprehensive reporting

**Output:**
```
🔍 Running comprehensive checks...
✅ Python 3.13 detected
✅ All dependencies installed
✅ Database connected
✅ API keys configured
✅ Django checks passed
✅ 4/7 APIs working
🚀 Starting server...
```

**Exit Codes:**
- 0: All checks passed
- 1: Critical error
- 2: Warning (continues anyway)

---

### test_api_now.sh

**Features:**
- ✅ Tests all 7 APIs
- ✅ Shows sample articles
- ✅ Reports working/failing APIs
- ✅ Quick execution

**Output:**
```
🧪 Testing APIs...
✅ NewsAPI: Working (5 articles)
✅ Guardian: Working (5 articles)
✅ MediaStack: Working (5 articles)
✅ NewsData: Working (5 articles)
⚠️ NYT: Not configured
⚠️ Currents: Not configured
❌ GNews: Failed (403)

📊 Result: 4/7 APIs working
```

**Exit Codes:**
- 0: At least one API working
- 1: No APIs working

---

## 🔧 Customizing Scripts

### Modify start.sh
```bash
# Edit the script
nano scripts/start.sh

# Add custom commands before server start
# Example: Run tests, clear cache, etc.
```

### Add New Script
```bash
# Create new script
touch scripts/my_script.sh

# Make executable
chmod +x scripts/my_script.sh

# Add shebang
echo '#!/bin/bash' > scripts/my_script.sh

# Add your commands
```

## 🐛 Troubleshooting

### Permission Denied
```bash
chmod +x scripts/*.sh
```

### Script Not Found
```bash
# Run from project root
./scripts/start.sh

# Or use full path
bash scripts/start.sh
```

### Python Not Found
```bash
# Check Python installation
which python3

# Update script to use correct Python
```

### Dependencies Missing
```bash
# Install manually
pip3 install -r requirements.txt
```

## 📚 Related Documentation

- **Setup Guide**: [docs/QUICKSTART.md](../docs/QUICKSTART.md)
- **API Setup**: [docs/MULTI_API_SETUP.md](../docs/MULTI_API_SETUP.md)
- **Deployment**: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)

## 💡 Tips

### Alias for Quick Access
Add to your `~/.bashrc` or `~/.zshrc`:
```bash
alias samachar-start='cd /path/to/samachar && ./scripts/start.sh'
alias samachar-check='cd /path/to/samachar && ./scripts/start_with_checks.sh'
alias samachar-test='cd /path/to/samachar && ./scripts/test_api_now.sh'
```

### Run in Background
```bash
./scripts/start.sh &
```

### View Logs
```bash
tail -f samachar.log
```

## 🎯 Common Workflows

### Morning Routine
```bash
./scripts/start_with_checks.sh  # Verify everything works
```

### After Git Pull
```bash
./scripts/start.sh  # Update dependencies and migrate
```

### Before Committing
```bash
./scripts/test_api_now.sh  # Verify APIs still work
python3 manage.py check    # Check for issues
```

### Troubleshooting
```bash
./scripts/start_with_checks.sh  # Run all checks
```

---

**Last Updated:** November 25, 2025  
**Scripts Status:** ✅ All working

**Navigate back to:** [Main README](../README.md)
