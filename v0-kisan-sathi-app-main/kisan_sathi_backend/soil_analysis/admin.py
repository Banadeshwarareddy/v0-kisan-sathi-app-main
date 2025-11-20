"""
SoilSense - Django Admin Configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import SoilSample, SoilResult, SoilFeedback, SoilHealthHistory


@admin.register(SoilSample)
class SoilSampleAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'farmer_name', 'location_display', 'ph', 'fertility_indicator',
        'is_processed', 'created_at'
    ]
    list_filter = ['is_processed', 'district', 'season', 'created_at']
    search_fields = ['farmer__username', 'farmer__first_name', 'village', 'taluk', 'district']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Farmer Information', {
            'fields': ('id', 'farmer', 'created_at')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'village', 'taluk', 'district', 'state', 'country')
        }),
        ('Soil Parameters', {
            'fields': ('ph', 'nitrogen', 'phosphorus', 'potassium', 'organic_carbon', 'moisture', 'texture')
        }),
        ('Additional Info', {
            'fields': ('soil_image', 'season', 'crop_type', 'is_processed')
        }),
    )
    
    def farmer_name(self, obj):
        return f"{obj.farmer.first_name} {obj.farmer.last_name}"
    farmer_name.short_description = 'Farmer'
    
    def location_display(self, obj):
        return f"{obj.village}, {obj.taluk}"
    location_display.short_description = 'Location'
    
    def fertility_indicator(self, obj):
        if hasattr(obj, 'result'):
            level = obj.result.fertility_level
            colors = {'high': 'green', 'medium': 'orange', 'low': 'red'}
            return format_html(
                '<span style="color: {}; font-weight: bold;">{}</span>',
                colors.get(level, 'gray'),
                level.upper()
            )
        return '-'
    fertility_indicator.short_description = 'Fertility'


@admin.register(SoilResult)
class SoilResultAdmin(admin.ModelAdmin):
    list_display = [
        'sample_id', 'farmer_name', 'soil_type', 'fertility_level',
        'fertility_score', 'confidence_score', 'created_at'
    ]
    list_filter = ['soil_type', 'fertility_level', 'created_at']
    search_fields = ['sample__farmer__username', 'sample__village']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Sample Info', {
            'fields': ('sample', 'created_at')
        }),
        ('AI Predictions', {
            'fields': ('soil_type', 'fertility_level', 'fertility_score', 'confidence_score', 'model_version')
        }),
        ('Nutrient Status', {
            'fields': ('nitrogen_status', 'phosphorus_status', 'potassium_status')
        }),
        ('Recommendations', {
            'fields': ('recommended_crops', 'organic_fertilizers', 'chemical_fertilizers', 
                      'irrigation_tips', 'soil_health_tips', 'explanation_text')
        }),
        ('Reports', {
            'fields': ('pdf_report', 'audio_report')
        }),
    )
    
    def sample_id(self, obj):
        return str(obj.sample.id)[:8]
    sample_id.short_description = 'Sample ID'
    
    def farmer_name(self, obj):
        return obj.sample.farmer.username
    farmer_name.short_description = 'Farmer'


@admin.register(SoilFeedback)
class SoilFeedbackAdmin(admin.ModelAdmin):
    list_display = [
        'sample_id', 'farmer_name', 'rating', 'is_accurate',
        'is_helpful', 'verified_by_expert', 'created_at'
    ]
    list_filter = ['rating', 'is_accurate', 'is_helpful', 'verified_by_expert', 'created_at']
    search_fields = ['farmer__username', 'feedback_text']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Feedback Info', {
            'fields': ('sample', 'farmer', 'created_at')
        }),
        ('Rating', {
            'fields': ('rating', 'is_accurate', 'is_helpful', 'feedback_text')
        }),
        ('Expert Verification', {
            'fields': ('verified_by_expert', 'expert_notes')
        }),
    )
    
    def sample_id(self, obj):
        return str(obj.sample.id)[:8]
    sample_id.short_description = 'Sample ID'
    
    def farmer_name(self, obj):
        return obj.farmer.username
    farmer_name.short_description = 'Farmer'


@admin.register(SoilHealthHistory)
class SoilHealthHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'farmer_name', 'location', 'test_date', 'ph_value',
        'fertility_score', 'created_at'
    ]
    list_filter = ['test_date', 'created_at']
    search_fields = ['farmer__username', 'location']
    readonly_fields = ['created_at']
    date_hierarchy = 'test_date'
    
    def farmer_name(self, obj):
        return obj.farmer.username
    farmer_name.short_description = 'Farmer'
