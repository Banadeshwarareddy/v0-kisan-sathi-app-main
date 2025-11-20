"""
SoilSense - AI Soil Analysis Models
Production-ready models for soil analysis and recommendations
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import uuid

User = get_user_model()


class SoilSample(models.Model):
    """
    Stores soil sample data submitted by farmers
    """
    TEXTURE_CHOICES = [
        ('sandy', 'Sandy'),
        ('loamy', 'Loamy'),
        ('clay', 'Clay'),
        ('silt', 'Silt'),
        ('sandy_loam', 'Sandy Loam'),
        ('clay_loam', 'Clay Loam'),
        ('silty_clay', 'Silty Clay'),
    ]
    
    SEASON_CHOICES = [
        ('kharif', 'Kharif (Monsoon)'),
        ('rabi', 'Rabi (Winter)'),
        ('zaid', 'Zaid (Summer)'),
        ('perennial', 'Perennial'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Farmer Information
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soil_samples')
    
    # Location Data
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    village = models.CharField(max_length=100)
    taluk = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default='Karnataka')
    country = models.CharField(max_length=100, default='India')
    
    # Soil Parameters (Manual Entry)
    ph = models.DecimalField(
        max_digits=3, 
        decimal_places=1,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('14.0'))],
        help_text="pH value (0-14)"
    )
    nitrogen = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0'))],
        help_text="Nitrogen content (kg/ha)"
    )
    phosphorus = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0'))],
        help_text="Phosphorus content (kg/ha)"
    )
    potassium = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0'))],
        help_text="Potassium content (kg/ha)"
    )
    organic_carbon = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('100.0'))],
        help_text="Organic Carbon percentage"
    )
    moisture = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('100.0'))],
        help_text="Moisture percentage"
    )
    texture = models.CharField(max_length=20, choices=TEXTURE_CHOICES, blank=True)
    
    # Image Upload
    soil_image = models.ImageField(upload_to='soil_images/', null=True, blank=True)
    
    # Additional Context
    season = models.CharField(max_length=20, choices=SEASON_CHOICES, blank=True)
    crop_type = models.CharField(max_length=100, blank=True, help_text="Intended crop")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_processed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['farmer', '-created_at']),
            models.Index(fields=['district', 'taluk', 'village']),
        ]
    
    def __str__(self):
        return f"Soil Sample {self.id} - {self.farmer.username} - {self.village}"


class SoilResult(models.Model):
    """
    Stores AI analysis results and recommendations
    """
    SOIL_TYPE_CHOICES = [
        ('red', 'Red Soil'),
        ('black', 'Black Soil'),
        ('alluvial', 'Alluvial Soil'),
        ('laterite', 'Laterite Soil'),
        ('desert', 'Desert Soil'),
        ('mountain', 'Mountain Soil'),
    ]
    
    FERTILITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    # Link to Sample
    sample = models.OneToOneField(SoilSample, on_delete=models.CASCADE, related_name='result')
    
    # AI Predictions
    soil_type = models.CharField(max_length=20, choices=SOIL_TYPE_CHOICES)
    fertility_level = models.CharField(max_length=10, choices=FERTILITY_CHOICES)
    fertility_score = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('100.0'))],
        help_text="Fertility score (0-100)"
    )
    
    # Nutrient Analysis
    nitrogen_status = models.CharField(max_length=10, choices=[('low', 'Low'), ('adequate', 'Adequate'), ('high', 'High')])
    phosphorus_status = models.CharField(max_length=10, choices=[('low', 'Low'), ('adequate', 'Adequate'), ('high', 'High')])
    potassium_status = models.CharField(max_length=10, choices=[('low', 'Low'), ('adequate', 'Adequate'), ('high', 'High')])
    
    # Recommendations (JSON fields)
    recommended_crops = models.JSONField(default=list, help_text="List of recommended crops")
    organic_fertilizers = models.JSONField(default=dict, help_text="Organic fertilizer recommendations")
    chemical_fertilizers = models.JSONField(default=dict, help_text="Chemical fertilizer recommendations")
    irrigation_tips = models.TextField(blank=True)
    soil_health_tips = models.TextField(blank=True)
    
    # AI Model Metadata
    confidence_score = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('100.0'))],
        help_text="Model confidence (0-100)"
    )
    explanation_text = models.TextField(blank=True, help_text="Why this recommendation")
    model_version = models.CharField(max_length=50, default='1.0')
    
    # Report Files
    pdf_report = models.FileField(upload_to='soil_reports/pdf/', null=True, blank=True)
    audio_report = models.FileField(upload_to='soil_reports/audio/', null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Result for {self.sample.id} - {self.soil_type} - {self.fertility_level}"


class SoilFeedback(models.Model):
    """
    Farmer feedback on soil analysis results
    """
    sample = models.ForeignKey(SoilSample, on_delete=models.CASCADE, related_name='feedbacks')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Feedback
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating 1-5 stars"
    )
    feedback_text = models.TextField(blank=True)
    is_accurate = models.BooleanField(default=True, help_text="Was the analysis accurate?")
    is_helpful = models.BooleanField(default=True, help_text="Was it helpful?")
    
    # Verification
    verified_by_expert = models.BooleanField(default=False)
    expert_notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback for {self.sample.id} - {self.rating} stars"


class SoilHealthHistory(models.Model):
    """
    Track soil health changes over time for trend analysis
    """
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soil_history')
    location = models.CharField(max_length=200, help_text="Village, Taluk, District")
    
    # Historical Data Points
    test_date = models.DateField()
    ph_value = models.DecimalField(max_digits=3, decimal_places=1)
    nitrogen_value = models.DecimalField(max_digits=6, decimal_places=2)
    phosphorus_value = models.DecimalField(max_digits=6, decimal_places=2)
    potassium_value = models.DecimalField(max_digits=6, decimal_places=2)
    fertility_score = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Link to original sample
    sample = models.ForeignKey(SoilSample, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['farmer', 'test_date']
        verbose_name_plural = "Soil Health Histories"
    
    def __str__(self):
        return f"{self.farmer.username} - {self.location} - {self.test_date}"
