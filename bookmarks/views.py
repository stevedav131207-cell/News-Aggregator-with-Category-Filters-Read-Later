from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import Bookmark
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@login_required
def bookmark_list_view(request):
    """Display all bookmarks for the current user"""
    bookmarks = Bookmark.objects.filter(user=request.user)
    
    context = {
        'bookmarks': bookmarks,
    }
    
    return render(request, 'bookmarks/list.html', context)


@login_required
@require_POST
def bookmark_create_view(request):
    """Create a new bookmark"""
    try:
        # Parse published_at date
        published_at_str = request.POST.get('published_at', '')
        try:
            published_at = datetime.fromisoformat(published_at_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            published_at = datetime.now()
        
        # Check if bookmark already exists
        url = request.POST.get('url')
        existing_bookmark = Bookmark.objects.filter(user=request.user, url=url).first()
        
        if existing_bookmark:
            return JsonResponse({
                'status': 'info',
                'message': 'Article already bookmarked'
            })
        
        # Create bookmark
        bookmark = Bookmark.objects.create(
            user=request.user,
            title=request.POST.get('title', ''),
            description=request.POST.get('description', ''),
            url=url,
            image_url=request.POST.get('image_url', ''),
            source=request.POST.get('source', ''),
            category=request.POST.get('category', 'other'),
            published_at=published_at,
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Article bookmarked successfully',
            'bookmark_id': bookmark.id
        })
    
    except Exception as e:
        logger.error(f'Error creating bookmark: {e}')
        return JsonResponse({
            'status': 'error',
            'message': 'Failed to bookmark article'
        }, status=500)


@login_required
def bookmark_update_view(request, id):
    """Update a bookmark's note"""
    bookmark = get_object_or_404(Bookmark, id=id, user=request.user)
    
    if request.method == 'POST':
        bookmark.note = request.POST.get('note', '')
        bookmark.save()
        messages.success(request, 'Bookmark updated successfully')
        return redirect('bookmark_list')
    
    context = {
        'bookmark': bookmark,
    }
    
    return render(request, 'bookmarks/edit.html', context)


@login_required
@require_POST
def bookmark_delete_view(request, id):
    """Delete a bookmark"""
    bookmark = get_object_or_404(Bookmark, id=id, user=request.user)
    bookmark.delete()
    messages.success(request, 'Bookmark deleted successfully')
    return redirect('bookmark_list')
