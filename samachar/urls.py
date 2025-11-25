"""
URL configuration for samachar project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('news.urls')),  # Dashboard and search
    path('', include('accounts.urls')),  # Login, register, logout
    path('bookmarks/', include('bookmarks.urls')),  # Bookmark management
]
