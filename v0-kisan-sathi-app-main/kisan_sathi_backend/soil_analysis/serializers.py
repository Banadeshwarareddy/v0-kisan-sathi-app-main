"""
SoilSense - API Serializers
"""
from rest_framework import serializers
from .models import SoilSample, SoilResult, SoilFeedback, SoilHealthHistory


class SoilSampleSerializer(serializers.ModelSerializer):
    """Serializer for creating and viewing soil samples"""
    
    class Meta:
        model = SoilSample
        fields = [
            'id', 'farmer', 'latitude', 'longitude', 'village', 'taluk', 
            'district', 'state', 'country', 'ph', 'nitrogen', 'phosphorus', 
            'potassium', 'organic_carbon', 'moisture', 'texture', 'soil_image',
            'season', 'crop_type', 'created_at', 'is_processed'
        ]
        read_only_fields = ['id', 'created_at', 'is_processed']
    
    def validate_ph(self, value):
        if value < 0 or value > 14:
            raise serializers.ValidationError("pH must be between 0 and 14")
        return value


class SoilResultSerializer(serializers.ModelSerializer):
    """Serializer for soil analysis results"""
    sample_id = serializers.UUIDField(source='sample.id', read_only=True)
    farmer_name = serializers.CharField(source='sample.farmer.first_name', read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = SoilResult
        fields = [
            'id', 'sample_id', 'farmer_name', 'location', 'soil_type', 
            'fertility_level', 'fertility_score', 'nitrogen_status', 
            'phosphorus_status', 'potassium_status', 'recommended_crops',
            'organic_fertilizers', 'chemical_fertilizers', 'irrigation_tips',
            'soil_health_tips', 'confidence_score', 'explanation_text',
            'pdf_report', 'audio_report', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_location(self, obj):
        return f"{obj.sample.village}, {obj.sample.taluk}, {obj.sample.district}"


class SoilAnalysisRequestSerializer(serializers.Serializer):
    """Serializer for soil analysis API request"""
    # Location
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    village = serializers.CharField(max_length=100)
    taluk = serializers.CharField(max_length=100)
    district = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, default='Karnataka')
    
    # Soil Parameters
    ph = serializers.DecimalField(max_digits=3, decimal_places=1)
    nitrogen = serializers.DecimalField(max_digits=6, decimal_places=2)
    phosphorus = serializers.DecimalField(max_digits=6, decimal_places=2)
    potassium = serializers.DecimalField(max_digits=6, decimal_places=2)
    organic_carbon = serializers.DecimalField(max_digits=5, decimal_places=2)
    moisture = serializers.DecimalField(max_digits=5, decimal_places=2)
    texture = serializers.ChoiceField(choices=SoilSample.TEXTURE_CHOICES, required=False)
    
    # Optional
    soil_image = serializers.ImageField(required=False)
    season = serializers.ChoiceField(choices=SoilSample.SEASON_CHOICES, required=False)
    crop_type = serializers.CharField(max_length=100, required=False)


class SoilFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for farmer feedback"""
    
    class Meta:
        model = SoilFeedback
        fields = [
            'id', 'sample', 'farmer', 'rating', 'feedback_text',
            'is_accurate', 'is_helpful', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'farmer']


class SoilHealthHistorySerializer(serializers.ModelSerializer):
    """Serializer for soil health history"""
    
    class Meta:
        model = SoilHealthHistory
        fields = [
            'id', 'farmer', 'location', 'test_date', 'ph_value',
            'nitrogen_value', 'phosphorus_value', 'potassium_value',
            'fertility_score', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
