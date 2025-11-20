"""
Django Admin for Marketplace
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    FarmerProfile, BuyerProfile, DeliveryAddress,
    CropCategory, CropProduct, ProductImage,
    CartItem, Order, OrderStatusHistory, Receipt,
    ProductReview, FarmerRating, Wishlist,
    Notification, Coupon, CouponUsage, DailyMetrics
)


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ['farm_name', 'user', 'verification_status', 'rating', 'total_sales', 'is_premium']
    list_filter = ['verification_status', 'is_premium', 'state']
    search_fields = ['farm_name', 'user__email', 'user__phone', 'district']
    readonly_fields = ['total_sales', 'total_orders', 'rating', 'review_count']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'farm_name', 'farm_registration_number', 'farm_size_acres')
        }),
        ('Location', {
            'fields': ('address', 'village', 'district', 'state', 'pincode', 'latitude', 'longitude')
        }),
        ('Verification', {
            'fields': ('verification_status', 'verification_documents', 'verified_by', 'verified_at', 'rejection_reason')
        }),
        ('Banking', {
            'fields': ('bank_account_number', 'ifsc_code', 'upi_id', 'pan_number', 'gst_number')
        }),
        ('Metrics', {
            'fields': ('total_sales', 'total_orders', 'rating', 'review_count')
        }),
        ('Premium', {
            'fields': ('is_premium', 'subscription_plan', 'subscription_expires_at')
        }),
    )


@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name', 'business_type', 'city', 'total_purchases', 'rating']
    list_filter = ['business_type', 'state']
    search_fields = ['company_name', 'user__email', 'user__phone', 'city']
    readonly_fields = ['total_purchases', 'total_orders', 'rating', 'review_count']


@admin.register(CropCategory)
class CropCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'level', 'display_order', 'is_active']
    list_filter = ['is_active', 'level']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(CropProduct)
class CropProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'farmer', 'category', 'price_per_unit', 'quantity_available', 'listing_status', 'rating', 'is_featured']
    list_filter = ['listing_status', 'is_featured', 'is_organic_certified', 'quality_grade', 'category']
    search_fields = ['name', 'farmer__farm_name', 'slug']
    readonly_fields = ['views_count', 'wishlist_count', 'cart_add_count', 'sales_count', 'rating', 'review_count']
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('farmer', 'category', 'name', 'slug', 'variety')
        }),
        ('Inventory', {
            'fields': ('quantity_available', 'unit', 'min_order_quantity', 'max_order_quantity')
        }),
        ('Pricing', {
            'fields': ('price_per_unit', 'original_price', 'bulk_pricing')
        }),
        ('Quality', {
            'fields': ('quality_grade', 'harvest_date', 'manufacturing_date', 'expiry_date')
        }),
        ('Certifications', {
            'fields': ('is_organic_certified', 'organic_cert_number', 'is_fssai_approved', 'certifications')
        }),
        ('Description', {
            'fields': ('description', 'specifications', 'storage_instructions')
        }),
        ('Media', {
            'fields': ('primary_image_url',)
        }),
        ('Status', {
            'fields': ('listing_status', 'is_featured', 'is_trending')
        }),
        ('Metrics', {
            'fields': ('views_count', 'wishlist_count', 'cart_add_count', 'sales_count', 'rating', 'review_count')
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'buyer', 'farmer', 'total_amount', 'order_status', 'payment_status', 'created_at']
    list_filter = ['order_status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'buyer__user__email', 'farmer__farm_name', 'tracking_number']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Info', {
            'fields': ('order_number', 'buyer', 'farmer', 'product')
        }),
        ('Order Details', {
            'fields': ('quantity_ordered', 'unit', 'unit_price', 'subtotal', 'total_amount')
        }),
        ('Status', {
            'fields': ('order_status', 'payment_status', 'payment_method')
        }),
        ('Delivery', {
            'fields': ('delivery_name', 'delivery_phone', 'delivery_address', 'delivery_city', 'delivery_state', 'delivery_pincode')
        }),
        ('Logistics', {
            'fields': ('tracking_number', 'courier_partner', 'estimated_delivery_date', 'actual_delivery_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'confirmed_at', 'shipped_at', 'delivered_at')
        }),
    )


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'buyer', 'rating', 'is_verified_purchase', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'is_verified_purchase', 'rating', 'created_at']
    search_fields = ['product__name', 'buyer__user__email', 'review_text']
    actions = ['approve_reviews', 'flag_reviews']
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "Approve selected reviews"
    
    def flag_reviews(self, request, queryset):
        queryset.update(is_flagged=True)
    flag_reviews.short_description = "Flag selected reviews"


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['discount_type', 'is_active', 'applicable_to']
    search_fields = ['code', 'description']
    date_hierarchy = 'valid_from'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'title', 'priority', 'is_read', 'created_at']
    list_filter = ['notification_type', 'priority', 'is_read', 'created_at']
    search_fields = ['user__email', 'title', 'message']
    date_hierarchy = 'created_at'


@admin.register(DailyMetrics)
class DailyMetricsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_orders', 'total_revenue', 'avg_order_value', 'new_farmers', 'new_buyers']
    list_filter = ['date']
    date_hierarchy = 'date'
    readonly_fields = ['date', 'total_orders', 'total_revenue', 'avg_order_value']


# Register remaining models
admin.site.register(DeliveryAddress)
admin.site.register(ProductImage)
admin.site.register(CartItem)
admin.site.register(OrderStatusHistory)
admin.site.register(Receipt)
admin.site.register(FarmerRating)
admin.site.register(Wishlist)
admin.site.register(CouponUsage)
