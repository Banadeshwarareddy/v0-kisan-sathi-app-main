from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Farmer
from rest_framework_simplejwt.tokens import RefreshToken


class FarmerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Farmer
        fields = ['phone', 'email', 'first_name', 'last_name', 'password', 'password2', 
                  'district', 'taluk', 'village', 'land_size', 'crops_grown', 'preferred_language']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        # Register without OTP: mark active and verified immediately
        farmer = Farmer.objects.create(**validated_data, is_active=True, is_verified=True)
        farmer.set_password(password)
        farmer.save()
        return farmer


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from phonenumbers import parse, format_number, PhoneNumberFormat, NumberParseException
        
        phone = attrs.get('phone')
        password = attrs.get('password')

        # Normalize phone number to handle different formats
        normalized_phone = None
        try:
            # Parse the phone number with India as default region
            parsed_phone = parse(phone, 'IN')
            # Format it consistently (E164 format: +91xxxxxxxxxx)
            normalized_phone = format_number(parsed_phone, PhoneNumberFormat.E164)
        except (NumberParseException, Exception):
            # If parsing fails, try to normalize manually
            phone_clean = phone.strip().replace(' ', '').replace('-', '')
            if not phone_clean.startswith('+'):
                # Remove leading 0 if present
                if phone_clean.startswith('0'):
                    phone_clean = phone_clean[1:]
                # Add +91 if not present
                if phone_clean.startswith('91'):
                    normalized_phone = f'+{phone_clean}'
                else:
                    normalized_phone = f'+91{phone_clean}'
            else:
                normalized_phone = phone_clean

        # Try to find farmer with normalized phone
        farmer = None
        try:
            # Try exact match first
            farmer = Farmer.objects.get(phone=normalized_phone)
        except Farmer.DoesNotExist:
            # Try finding by matching string representation
            try:
                # Query all farmers and match by string representation
                all_farmers = Farmer.objects.all()
                for f in all_farmers:
                    farmer_phone_str = str(f.phone)
                    # Compare normalized forms
                    if (farmer_phone_str == normalized_phone or 
                        farmer_phone_str.replace(' ', '') == normalized_phone.replace(' ', '') or
                        farmer_phone_str == phone):
                        farmer = f
                        break
            except Exception:
                pass

        if not farmer:
            raise serializers.ValidationError({"non_field_errors": ["Invalid phone number or password"]})

        if not farmer.check_password(password):
            raise serializers.ValidationError({"non_field_errors": ["Invalid phone number or password"]})

        if not farmer.is_active:
            raise serializers.ValidationError({"non_field_errors": ["Your account is inactive. Please contact support."]})

        # OTP verification disabled: do not block login on is_verified

        refresh = RefreshToken.for_user(farmer)

        return {
            'farmer': farmer,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ['id', 'phone', 'email', 'first_name', 'last_name', 'district', 
                  'taluk', 'village', 'land_size', 'crops_grown', 'preferred_language', 
                  'profile_picture', 'is_verified', 'created_at']
        read_only_fields = ['phone', 'is_verified', 'created_at']


