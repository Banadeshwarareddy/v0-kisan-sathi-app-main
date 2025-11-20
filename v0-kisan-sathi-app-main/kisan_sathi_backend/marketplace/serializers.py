"""
REST API Serializers for Marketplace
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    FarmerProfile, BuyerProfile, DeliveryAddress,
    CropCategory, CropProduct, ProductImage,
    CartItem, Order, OrderStatusHistory, Receipt,
    ProductReview, FarmerRating, Wishlist,
    Notification, Coupon, CouponUsage
)

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info"""
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'first_name', 'last_name']
        read_only_fields = fields


class FarmerProfileSerializer(serializers.ModelSerializer):
    """Farmer profile with user details"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['total_sales', 'total_orders', 'rating', 'review_count']


class FarmerProfileListSerializer(serializers.ModelSerializer):
    """Simplified farmer list"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = ['id', 'farm_name', 'user_name', 'district', 'state', 'rating', 'verification_status', 'is_premium']


class BuyerProfileSerializer(serializers.ModelSerializer):
    """Buyer profile with user details"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = BuyerProfile
        fields = '__all__'
        read_only_fields = ['total_purchases', 'total_orders', 'rating', 'review_count']


class DeliveryAddressSerializer(serializers.ModelSerializer):
    """Delivery address"""
    class Meta:
        model = DeliveryAddress
        fields = '__all__'
        read_only_fields = ['buyer', 'created_at', 'updated_at']


class CropCategorySerializer(serializers.ModelSerializer):
    """Category with hierarchy"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = CropCategory
        fields = '__all__'
    
    def get_children(self, obj):
        if obj.children.exists():
            return CropCategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    """Product images"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = '__all__'
        read_only_fields = ['product', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.original_url


class CropProductSerializer(serializers.ModelSerializer):
    """Full product details"""
    farmer = FarmerProfileListSerializer(read_only=True)
    category = CropCategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    primary_image_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CropProduct
        fields = '__all__'
        read_only_fields = [
            'views_count', 'wishlist_count', 'cart_add_count', 
            'sales_count', 'rating', 'review_count', 'is_deleted', 'deleted_at'
        ]
    
    def get_primary_image_display(self, obj):
        if obj.primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.primary_image.url)
            return obj.primary_image.url
        return obj.primary_image_url


class CropProductCreateSerializer(serializers.ModelSerializer):
    """Create/Update product with image upload"""
    category_id = serializers.UUIDField(write_only=True)
    primary_image = serializers.ImageField(required=False, allow_null=True)
    additional_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = CropProduct
        fields = [
            'id', 'category_id', 'name', 'variety', 'quantity_available', 'unit',
            'min_order_quantity', 'max_order_quantity', 'price_per_unit', 'original_price',
            'quality_grade', 'harvest_date', 'manufacturing_date', 'expiry_date',
            'is_organic_certified', 'organic_cert_number', 'is_fssai_approved',
            'description', 'storage_instructions', 'primary_image', 'additional_images',
            'listing_status', 'available_from', 'available_until'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        additional_images = validated_data.pop('additional_images', [])
        
        # Get category
        category = CropCategory.objects.get(id=category_id)
        validated_data['category'] = category
        
        # Create product
        product = CropProduct.objects.create(**validated_data)
        
        # Create additional images
        for idx, image in enumerate(additional_images):
            ProductImage.objects.create(
                product=product,
                image=image,
                display_order=idx + 1,
                is_primary=False
            )
        
        return product
    
    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        additional_images = validated_data.pop('additional_images', [])
        
        if category_id:
            category = CropCategory.objects.get(id=category_id)
            validated_data['category'] = category
        
        # Update product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Add new images if provided
        if additional_images:
            existing_count = instance.images.count()
            for idx, image in enumerate(additional_images):
                ProductImage.objects.create(
                    product=instance,
                    image=image,
                    display_order=existing_count + idx + 1,
                    is_primary=False
                )
        
        return instance


class CropProductListSerializer(serializers.ModelSerializer):
    """Simplified product list for browsing"""
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = CropProduct
        fields = [
            'id', 'name', 'slug', 'farmer_name', 'category_name',
            'price_per_unit', 'original_price', 'discount_percentage',
            'unit', 'quantity_available', 'primary_image_url',
            'rating', 'review_count', 'is_organic_certified',
            'quality_grade', 'listing_status', 'is_featured'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    """Shopping cart item"""
    product = CropProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = '__all__'
        read_only_fields = ['buyer', 'session_id', 'unit_price', 'created_at', 'updated_at', 'expires_at']
    
    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = CropProduct.objects.get(id=product_id)
        validated_data['product'] = product
        validated_data['unit_price'] = product.price_per_unit
        
        # Set expiry
        from django.utils import timezone
        from datetime import timedelta
        validated_data['expires_at'] = timezone.now() + timedelta(days=7)
        
        return super().create(validated_data)


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Order status change history"""
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = '__all__'
        read_only_fields = ['order', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Full order details"""
    buyer = BuyerProfileSerializer(read_only=True)
    farmer = FarmerProfileListSerializer(read_only=True)
    product = CropProductListSerializer(read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = [
            'order_number', 'created_at', 'updated_at',
            'placed_at', 'confirmed_at', 'shipped_at', 'delivered_at'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified order list"""
    buyer_name = serializers.CharField(source='buyer.user.get_full_name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer_name', 'farmer_name', 'product_name',
            'total_amount', 'order_status', 'payment_status',
            'estimated_delivery_date', 'created_at'
        ]


class ReceiptSerializer(serializers.ModelSerializer):
    """Invoice/Receipt"""
    order = OrderListSerializer(read_only=True)
    
    class Meta:
        model = Receipt
        fields = '__all__'
        read_only_fields = ['receipt_number', 'created_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Product review"""
    buyer_name = serializers.CharField(source='buyer.user.get_full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = '__all__'
        read_only_fields = [
            'buyer', 'is_verified_purchase', 'helpful_count', 
            'reported_count', 'is_approved', 'is_flagged',
            'moderated_by', 'moderation_notes', 'moderated_at', 'created_at'
        ]


class FarmerRatingSerializer(serializers.ModelSerializer):
    """Farmer rating"""
    buyer_name = serializers.CharField(source='buyer.user.get_full_name', read_only=True)
    
    class Meta:
        model = FarmerRating
        fields = '__all__'
        read_only_fields = ['buyer', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist item"""
    product = CropProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['buyer', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Notification"""
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class CouponSerializer(serializers.ModelSerializer):
    """Coupon"""
    is_valid_now = serializers.SerializerMethodField()
    
    class Meta:
        model = Coupon
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']
    
    def get_is_valid_now(self, obj):
        return obj.is_valid()


class CouponUsageSerializer(serializers.ModelSerializer):
    """Coupon usage tracking"""
    coupon_code = serializers.CharField(source='coupon.code', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = CouponUsage
        fields = '__all__'
        read_only_fields = ['created_at']


# ============================================================================
# CREATE ORDER SERIALIZER (For checkout)
# ============================================================================

class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders from cart"""
    product_id = serializers.UUIDField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=3)
    delivery_address_id = serializers.UUIDField()
    payment_method = serializers.CharField(max_length=50)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    buyer_notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_product_id(self, value):
        try:
            product = CropProduct.objects.get(id=value, listing_status='active', is_deleted=False)
            return value
        except CropProduct.DoesNotExist:
            raise serializers.ValidationError("Product not found or not available")
    
    def validate_delivery_address_id(self, value):
        try:
            address = DeliveryAddress.objects.get(id=value, is_active=True)
            return value
        except DeliveryAddress.DoesNotExist:
            raise serializers.ValidationError("Delivery address not found")
    
    def validate(self, data):
        product = CropProduct.objects.get(id=data['product_id'])
        if data['quantity'] > product.quantity_available:
            raise serializers.ValidationError("Requested quantity not available")
        if data['quantity'] < product.min_order_quantity:
            raise serializers.ValidationError(f"Minimum order quantity is {product.min_order_quantity}")
        return data
