"""
SoilSense - URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'soil_analysis'

# Router for ViewSets
router = DefaultRouter()
router.register(r'samples', views.SoilAnalysisViewSet, basename='soil-sample')
router.register(r'feedback', views.SoilFeedbackViewSet, basename='soil-feedback')

urlpatterns = [
    # ViewSet routes
    path('', include(router.urls)),
    
    # Custom endpoints
    path('dashboard/', views.dashboard_summary, name='dashboard'),
    path('regional-stats/', views.regional_stats, name='regional-stats'),
]
