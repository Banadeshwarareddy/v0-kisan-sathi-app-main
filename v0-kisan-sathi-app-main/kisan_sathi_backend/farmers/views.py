from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Farmer
from .serializers import FarmerRegistrationSerializer, LoginSerializer, FarmerProfileSerializer
from .utils import generate_otp, send_otp_sms, send_otp_email, verify_otp


class SignupAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = FarmerRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            farmer = serializer.save()
            return Response({
                'success': True,
                'message': 'Registration successful.',
                'data': {'phone': str(farmer.phone), 'email': farmer.email}
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')

        if not phone or not otp:
            return Response({
                'success': False,
                'message': 'Phone and OTP required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            farmer = Farmer.objects.get(phone=phone)
        except Farmer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Farmer not found'
            }, status=status.HTTP_404_NOT_FOUND)

        is_valid, message = verify_otp(farmer, otp)

        if is_valid:
            return Response({
                'success': True,
                'message': message
            })
        else:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            farmer = data['farmer']

            # Return complete farmer profile using serializer
            profile_serializer = FarmerProfileSerializer(farmer)
            farmer_data = profile_serializer.data
            # Add computed name field for compatibility
            farmer_data['name'] = f"{farmer.first_name} {farmer.last_name}".strip()
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'access_token': data['access_token'],
                    'refresh_token': data['refresh_token'],
                    'farmer': farmer_data
                }
            })

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = FarmerProfileSerializer(request.user)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def put(self, request):
        serializer = FarmerProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
