from django.urls import path
from .views import SignupAPIView, VerifyOTPView, LoginAPIView, ProfileView
from .admin_views import (
    AdminStatsView,
    AdminUsersListView,
    AdminUserActivityView,
    AdminUserDetailView
)


app_name = 'farmers'


urlpatterns = [
    # User endpoints
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Admin endpoints
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUsersListView.as_view(), name='admin-users'),
    path('admin/activity/', AdminUserActivityView.as_view(), name='admin-activity'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]


