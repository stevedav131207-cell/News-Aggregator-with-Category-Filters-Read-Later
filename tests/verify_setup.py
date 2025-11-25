#!/usr/bin/env python3
"""
SAMACHAR Setup Verification Script
Checks if all modules are properly interconnected
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} MISSING: {filepath}")
        return False

def check_directory_exists(dirpath, description):
    """Check if a directory exists"""
    if Path(dirpath).is_dir():
        print(f"✅ {description}: {dirpath}")
        return True
    else:
        print(f"❌ {description} MISSING: {dirpath}")
        return False

def main():
    print("=" * 60)
    print("SAMACHAR Setup Verification")
    print("=" * 60)
    print()
    
    all_checks_passed = True
    
    # Check main project files
    print("📁 Main Project Files:")
    all_checks_passed &= check_file_exists("manage.py", "Django manage.py")
    all_checks_passed &= check_file_exists("samachar/settings.py", "Settings")
    all_checks_passed &= check_file_exists("samachar/urls.py", "Main URLs")
    all_checks_passed &= check_file_exists(".env", "Environment file")
    all_checks_passed &= check_file_exists("requirements.txt", "Requirements")
    print()
    
    # Check apps
    print("📦 Django Apps:")
    all_checks_passed &= check_directory_exists("accounts", "Accounts app")
    all_checks_passed &= check_directory_exists("news", "News app")
    all_checks_passed &= check_directory_exists("bookmarks", "Bookmarks app")
    print()
    
    # Check accounts app
    print("👤 Accounts App:")
    all_checks_passed &= check_file_exists("accounts/views.py", "Accounts views")
    all_checks_passed &= check_file_exists("accounts/urls.py", "Accounts URLs")
    all_checks_passed &= check_file_exists("accounts/forms.py", "Accounts forms")
    all_checks_passed &= check_file_exists("accounts/templates/accounts/login.html", "Login template")
    all_checks_passed &= check_file_exists("accounts/templates/accounts/register.html", "Register template")
    print()
    
    # Check news app
    print("📰 News App:")
    all_checks_passed &= check_file_exists("news/views.py", "News views")
    all_checks_passed &= check_file_exists("news/urls.py", "News URLs")
    all_checks_passed &= check_file_exists("news/news_api_client.py", "NewsAPI client")
    all_checks_passed &= check_file_exists("news/templates/news/dashboard.html", "Dashboard template")
    all_checks_passed &= check_file_exists("news/templates/news/search_results.html", "Search template")
    print()
    
    # Check bookmarks app
    print("🔖 Bookmarks App:")
    all_checks_passed &= check_file_exists("bookmarks/models.py", "Bookmark model")
    all_checks_passed &= check_file_exists("bookmarks/views.py", "Bookmarks views")
    all_checks_passed &= check_file_exists("bookmarks/urls.py", "Bookmarks URLs")
    all_checks_passed &= check_file_exists("bookmarks/templates/bookmarks/list.html", "Bookmarks list template")
    all_checks_passed &= check_file_exists("bookmarks/templates/bookmarks/edit.html", "Bookmarks edit template")
    print()
    
    # Check templates
    print("🎨 Templates:")
    all_checks_passed &= check_file_exists("templates/base.html", "Base template")
    all_checks_passed &= check_file_exists("templates/404.html", "404 template")
    all_checks_passed &= check_file_exists("templates/500.html", "500 template")
    print()
    
    # Check static files
    print("📦 Static Files:")
    all_checks_passed &= check_file_exists("static/js/app.js", "Main JavaScript")
    all_checks_passed &= check_file_exists("static/js/offline.js", "Offline manager")
    all_checks_passed &= check_file_exists("static/css/custom.css", "Custom CSS")
    all_checks_passed &= check_file_exists("static/images/placeholder.svg", "Placeholder image")
    print()
    
    # Check documentation
    print("📚 Documentation:")
    all_checks_passed &= check_file_exists("README.md", "README")
    all_checks_passed &= check_file_exists("QUICKSTART.md", "Quick Start Guide")
    all_checks_passed &= check_file_exists("FEATURES.md", "Features List")
    all_checks_passed &= check_file_exists("DEPLOYMENT.md", "Deployment Guide")
    all_checks_passed &= check_file_exists("MODULE_INTERCONNECTIONS.md", "Module Interconnections")
    print()
    
    # Check environment
    print("🔧 Environment Configuration:")
    if Path(".env").exists():
        with open(".env", "r") as f:
            content = f.read()
            if "NEWS_API_KEY=" in content:
                if "NEWS_API_KEY=\n" in content or "NEWS_API_KEY=" == content.strip():
                    print("⚠️  NEWS_API_KEY is empty - please add your API key")
                else:
                    print("✅ NEWS_API_KEY is configured")
            else:
                print("❌ NEWS_API_KEY not found in .env")
                all_checks_passed = False
    print()
    
    # Check database
    print("💾 Database:")
    if Path("db.sqlite3").exists():
        print("✅ Database file exists")
        print("   Run 'python3 manage.py migrate' if you haven't already")
    else:
        print("⚠️  Database not created yet")
        print("   Run 'python3 manage.py migrate' to create it")
    print()
    
    # Final summary
    print("=" * 60)
    if all_checks_passed:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Next steps:")
        print("1. Add your NewsAPI key to .env file")
        print("2. Run: python3 manage.py migrate")
        print("3. Run: python3 manage.py runserver")
        print("4. Visit: http://127.0.0.1:8000/")
    else:
        print("❌ SOME CHECKS FAILED")
        print()
        print("Please review the missing files above.")
    print("=" * 60)
    
    return 0 if all_checks_passed else 1

if __name__ == "__main__":
    sys.exit(main())
