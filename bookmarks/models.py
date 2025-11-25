from django.db import models
from django.contrib.auth.models import User


class Bookmark(models.Model):
    """Model for storing user bookmarks"""
    
    CATEGORY_CHOICES = [
        ('india', 'India'),
        ('world', 'World'),
        ('business', 'Business'),
        ('technology', 'Technology'),
        ('sports', 'Sports'),
        ('entertainment', 'Entertainment'),
        ('science', 'Science'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    image_url = models.URLField(blank=True)
    source = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    published_at = models.DateTimeField()
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'url']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
