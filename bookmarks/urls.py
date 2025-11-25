from django.urls import path
from . import views

urlpatterns = [
    path('', views.bookmark_list_view, name='bookmark_list'),
    path('add/', views.bookmark_create_view, name='bookmark_create'),
    path('<int:id>/edit/', views.bookmark_update_view, name='bookmark_update'),
    path('<int:id>/delete/', views.bookmark_delete_view, name='bookmark_delete'),
]
