from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Count, Q, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Farmer
from .serializers import FarmerProfileSerializer


class AdminStatsView(APIView):
    """Get admin dashboard statistics"""
    permission_classes = [AllowAny]  # Temporarily allow anyone for testing
    
    def get(self, request):
        # Total users
        total_users = Farmer.objects.count()
        
        # Active users (logged in within last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_users = Farmer.objects.filter(last_login__gte=thirty_days_ago).count()
        
        # Users by role
        farmers_count = Farmer.objects.filter(user_type='farmer').count()
        buyers_count = Farmer.objects.filter(user_type='buyer').count()
        
        # New signups today
        today = timezone.now().date()
        new_signups_today = Farmer.objects.filter(date_joined__date=today).count()
        
        # Active users today (logged in today)
        active_today = Farmer.objects.filter(last_login__date=today).count()
        
        return Response({
            'success': True,
            'data': {
                'total_users': total_users,
                'active_users': active_users,
                'farmers_count': farmers_count,
                'buyers_count': buyers_count,
                'new_signups_today': new_signups_today,
                'active_today': active_today,
                'total_transactions': 0,  # TODO: Implement when transaction model exists
                'revenue': 0,  # TODO: Implement when transaction model exists
            }
        })


class AdminUsersListView(APIView):
    """Get list of all users with filters"""
    permission_classes = [AllowAny]  # Temporarily allow anyone for testing
    
    def get(self, request):
        # Get query parameters
        role_filter = request.query_params.get('role', 'all')
        status_filter = request.query_params.get('status', 'all')
        search = request.query_params.get('search', '')
        
        # Base queryset
        users = Farmer.objects.all()
        
        # Apply filters
        if role_filter != 'all':
            users = users.filter(user_type=role_filter)
        
        if status_filter == 'active':
            thirty_days_ago = timezone.now() - timedelta(days=30)
            users = users.filter(last_login__gte=thirty_days_ago)
        elif status_filter == 'inactive':
            thirty_days_ago = timezone.now() - timedelta(days=30)
            users = users.filter(Q(last_login__lt=thirty_days_ago) | Q(last_login__isnull=True))
        
        # Search
        if search:
            users = users.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search)
            )
        
        # Order by most recent
        users = users.order_by('-date_joined')
        
        # Serialize data
        users_data = []
        for user in users:
            # Determine status
            if user.last_login:
                thirty_days_ago = timezone.now() - timedelta(days=30)
                user_status = 'active' if user.last_login >= thirty_days_ago else 'inactive'
            else:
                user_status = 'inactive'
            
            # Count logins (you may want to track this in a separate model)
            login_count = 0  # TODO: Implement login tracking
            
            users_data.append({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'phone': str(user.phone),
                'district': user.district,
                'village': user.village,
                'role': user.user_type,
                'joinDate': user.date_joined.strftime('%Y-%m-%d'),
                'lastLogin': user.last_login.strftime('%Y-%m-%d %I:%M %p') if user.last_login else 'Never',
                'status': user_status,
                'loginCount': login_count,
                'is_verified': user.is_verified,
            })
        
        return Response({
            'success': True,
            'data': users_data,
            'count': len(users_data)
        })


class AdminUserActivityView(APIView):
    """Get user login activity and recent signups"""
    permission_classes = [AllowAny]  # Temporarily allow anyone for testing
    
    def get(self, request):
        # Recent logins (last 50)
        recent_logins = Farmer.objects.filter(
            last_login__isnull=False
        ).order_by('-last_login')[:50]
        
        # Recent signups (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_signups = Farmer.objects.filter(
            date_joined__gte=seven_days_ago
        ).order_by('-date_joined')
        
        # Today's stats
        today = timezone.now().date()
        logins_today = Farmer.objects.filter(last_login__date=today).count()
        signups_today = Farmer.objects.filter(date_joined__date=today).count()
        
        # Active users now (logged in within last hour)
        one_hour_ago = timezone.now() - timedelta(hours=1)
        active_now = Farmer.objects.filter(last_login__gte=one_hour_ago).count()
        
        # Serialize recent logins
        logins_data = []
        for user in recent_logins:
            thirty_days_ago = timezone.now() - timedelta(days=30)
            user_status = 'active' if user.last_login >= thirty_days_ago else 'inactive'
            
            logins_data.append({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'role': user.user_type,
                'lastLogin': user.last_login.strftime('%Y-%m-%d %I:%M %p'),
                'status': user_status,
                'loginCount': 0,  # TODO: Implement
            })
        
        # Serialize recent signups
        signups_data = []
        for user in recent_signups:
            signups_data.append({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'phone': str(user.phone),
                'role': user.user_type,
                'joinDate': user.date_joined.strftime('%Y-%m-%d'),
                'district': user.district,
            })
        
        return Response({
            'success': True,
            'data': {
                'stats': {
                    'logins_today': logins_today,
                    'signups_today': signups_today,
                    'active_now': active_now,
                    'avg_session_time': 24,  # TODO: Implement session tracking
                },
                'recent_logins': logins_data,
                'recent_signups': signups_data,
            }
        })


class AdminUserDetailView(APIView):
    """Get or update specific user details"""
    permission_classes = [AllowAny]  # Temporarily allow anyone for testing
    
    def get(self, request, user_id):
        try:
            user = Farmer.objects.get(id=user_id)
            serializer = FarmerProfileSerializer(user)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Farmer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, user_id):
        try:
            user = Farmer.objects.get(id=user_id)
            serializer = FarmerProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'User updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Farmer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, user_id):
        try:
            user = Farmer.objects.get(id=user_id)
            user.delete()
            return Response({
                'success': True,
                'message': 'User deleted successfully'
            })
        except Farmer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
