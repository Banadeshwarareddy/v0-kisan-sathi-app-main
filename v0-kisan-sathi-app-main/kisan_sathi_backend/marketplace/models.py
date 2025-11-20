"""
Enterprise-grade Marketplace Models
Supports 100K+ concurrent users, 10K+ daily orders
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
import uuid

User = get_user_model()


# ============================================================================
# ENUMS & CHOICES
# ============================================================================

class UserType(models.TextChoices):
    FARMER = 'farmer', _('Farmer')
    BUYER = 'buyer', _('Buyer')
    ADMIN = 'admin', _('Admin')
    LOGISTICS = 'logistics_partner', _('Logistics Partner')


class VerificationStatus(models.TextChoices):
    PENDING = 'pending', _('Pending')
    IN_REVIEW = 'in_review', _('In Review')
    VERIFIED = 'verified', _('Verified')
    REJECTED = 'rejected', _('Rejected')


class OrderStatus(models.TextChoices):
    PENDING = 'pending', _('Pending')
    CONFIRMED = 'confirmed', _('Confirmed')
    PROCESSING = 'processing', _('Processing')
    PACKED = 'packed', _('Packed')
    SHIPPED = 'shipped', _('Shipped')
    IN_TRANSIT = 'in_transit', _('In Transit')
    OUT_FOR_DELIVERY = 'out_for_delivery', _('Out for Delivery')
    DELIVERED = 'delivered', _('Delivered')
    CANCELLED = 'cancelled', _('Cancelled')
    RETURNED = 'returned', _('Returned')
    REFUNDED = 'refunded', _('Refunded')


class PaymentStatus(models.TextChoices):
    UNPAID = 'unpaid', _('Unpaid')
    PENDING = 'pending', _('Pending')
    PROCESSING = 'processing', _('Processing')
    PAID = 'paid', _('Paid')
    PARTIALLY_PAID = 'partially_paid', _('Partially Paid')
    REFUNDED = 'refunded', _('Refunded')
    FAILED = 'failed', _('Failed')


class ListingStatus(models.TextChoices):
    DRAFT = 'draft', _('Draft')
    ACTIVE = 'active', _('Active')
    INACTIVE = 'inactive', _('Inactive')
    SOLDOUT = 'soldout', _('Sold Out')
    EXPIRED = 'expired', _('Expired')
    SUSPENDED = 'suspended', _('Suspended')


class QualityGrade(models.TextChoices):
    PREMIUM = 'premium', _('Premium')
    GRADE_A = 'grade_a', _('Grade A')
    GRADE_B = 'grade_b', _('Grade B')
    GRADE_C = 'grade_c', _('Grade C')
    STANDARD = 'standard', _('Standard')


class Unit(models.TextChoices):
    KG = 'kg', _('Kilogram')
    GRAM = 'gram', _('Gram')
    QUINTAL = 'quintal', _('Quintal')
    TON = 'ton', _('Ton')
    PIECE = 'piece', _('Piece')
    DOZEN = 'dozen', _('Dozen')
    BAG_25KG = 'bag_25kg', _('Bag (25kg)')
    BAG_50KG = 'bag_50kg', _('Bag (50kg)')
    LITRE = 'litre', _('Litre')


class BusinessType(models.TextChoices):
    INDIVIDUAL = 'individual', _('Individual')
    RETAILER = 'retailer', _('Retailer')
    WHOLESALER = 'wholesaler', _('Wholesaler')
    RESTAURANT = 'restaurant', _('Restaurant')
    HOTEL = 'hotel', _('Hotel')
    FOOD_PROCESSOR = 'food_processor', _('Food Processor')
    EXPORT_HOUSE = 'export_house', _('Export House')
    GOVERNMENT = 'government', _('Government')


# ============================================================================
# BASE MODEL WITH COMMON FIELDS
# ============================================================================

class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """Abstract base model with soft delete"""
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def soft_delete(self):
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()


# ============================================================================
# FARMER PROFILES
# ============================================================================

class FarmerProfile(TimeStampedModel):
    """Farmer/Seller profile with verification and geospatial data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    
    # Farm Information
    farm_name = models.CharField(max_length=255)
    farm_registration_number = models.CharField(max_length=100, unique=True, null=True, blank=True)
    farm_size_acres = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Location
    address = models.TextField()
    village = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    pincode = models.CharField(max_length=10, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Verification
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
        db_index=True
    )
    verification_documents = models.JSONField(default=dict, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_farmers')
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Banking (Store encrypted in application layer)
    bank_account_number = models.CharField(max_length=255, blank=True)
    ifsc_code = models.CharField(max_length=15, blank=True)
    upi_id = models.CharField(max_length=100, blank=True)
    pan_number = models.CharField(max_length=255, blank=True)
    gst_number = models.CharField(max_length=20, blank=True)
    
    # Business Metrics
    total_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    review_count = models.IntegerField(default=0)
    
    # Compliance
    fssai_license = models.CharField(max_length=100, blank=True)
    organic_certification_url = models.URLField(blank=True)
    
    # Metadata
    bio = models.TextField(blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    
    # Status
    is_premium = models.BooleanField(default=False)
    subscription_plan = models.CharField(max_length=50, blank=True)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_farmer_profiles'
        indexes = [
            models.Index(fields=['verification_status', '-rating']),
            models.Index(fields=['state', 'district']),
        ]

    def __str__(self):
        return f"{self.farm_name} - {self.user.get_full_name()}"


# ============================================================================
# BUYER PROFILES
# ============================================================================

class BuyerProfile(TimeStampedModel):
    """Buyer profile with business classification"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
    
    # Business Information
    company_name = models.CharField(max_length=255, blank=True)
    business_type = models.CharField(max_length=20, choices=BusinessType.choices)
    business_registration_number = models.CharField(max_length=100, blank=True)
    gst_number = models.CharField(max_length=20, blank=True)
    
    # Default Delivery Address
    default_address = models.TextField()
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    pincode = models.CharField(max_length=10)
    landmark = models.CharField(max_length=255, blank=True)
    
    # Business Metrics
    total_purchases = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    review_count = models.IntegerField(default=0)
    
    # Credit
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    credit_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    payment_terms = models.CharField(max_length=50, default='immediate')
    
    # Preferences
    preferred_categories = models.JSONField(default=list, blank=True)
    max_delivery_distance_km = models.IntegerField(default=100)

    class Meta:
        db_table = 'marketplace_buyer_profiles'
        indexes = [
            models.Index(fields=['business_type']),
            models.Index(fields=['city', 'state']),
        ]

    def __str__(self):
        return f"{self.company_name or self.user.get_full_name()} ({self.business_type})"


# ============================================================================
# DELIVERY ADDRESSES
# ============================================================================

class DeliveryAddress(TimeStampedModel):
    """Multiple delivery addresses per buyer"""
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name='delivery_addresses')
    
    label = models.CharField(max_length=100, blank=True)  # "Home", "Office", "Warehouse A"
    contact_name = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=15)
    
    address_line1 = models.TextField()
    address_line2 = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    landmark = models.CharField(max_length=255, blank=True)
    
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'marketplace_delivery_addresses'
        indexes = [
            models.Index(fields=['buyer', 'is_active']),
        ]

    def __str__(self):
        return f"{self.label or 'Address'} - {self.contact_name}"


# ============================================================================
# CROP CATEGORIES
# ============================================================================

class CropCategory(TimeStampedModel):
    """Hierarchical product categories with multilingual support"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    
    # Multilingual
    translations = models.JSONField(default=dict, blank=True)
    
    # Hierarchy
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    level = models.IntegerField(default=0)
    path = models.CharField(max_length=255, blank=True)  # Materialized path
    
    # Display
    description = models.TextField(blank=True)
    icon_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    display_order = models.IntegerField(default=0)
    
    # Metadata
    hsn_code = models.CharField(max_length=20, blank=True)
    typical_shelf_life_days = models.IntegerField(null=True, blank=True)
    storage_temperature_range = models.CharField(max_length=50, blank=True)
    
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'marketplace_crop_categories'
        verbose_name_plural = 'Crop Categories'
        indexes = [
            models.Index(fields=['parent', 'is_active']),
            models.Index(fields=['path']),
        ]

    def __str__(self):
        return self.name


# Continuing in next part due to length...


# ============================================================================
# CROP PRODUCTS
# ============================================================================

class CropProduct(TimeStampedModel, SoftDeleteModel):
    """Main product listing with inventory and pricing"""
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(CropCategory, on_delete=models.PROTECT, related_name='products')
    
    # Product Info
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255)
    variety = models.CharField(max_length=100, blank=True)
    
    # Multilingual
    translations = models.JSONField(default=dict, blank=True)
    
    # Inventory
    quantity_available = models.DecimalField(
        max_digits=12,
        decimal_places=3,
        validators=[MinValueValidator(0)]
    )
    unit = models.CharField(max_length=20, choices=Unit.choices)
    min_order_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=1)
    max_order_quantity = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    
    # Pricing
    price_per_unit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    original_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    bulk_pricing = models.JSONField(default=list, blank=True)
    
    # Quality
    quality_grade = models.CharField(max_length=20, choices=QualityGrade.choices, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    manufacturing_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    
    # Certifications
    is_organic_certified = models.BooleanField(default=False)
    organic_cert_number = models.CharField(max_length=100, blank=True)
    is_fssai_approved = models.BooleanField(default=False)
    certifications = models.JSONField(default=list, blank=True)
    
    # Description
    description = models.TextField(blank=True)
    description_html = models.TextField(blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    storage_instructions = models.TextField(blank=True)
    
    # Media
    primary_image = models.ImageField(upload_to='marketplace/products/', blank=True, null=True)
    primary_image_url = models.URLField(blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    
    # Status
    listing_status = models.CharField(
        max_length=20,
        choices=ListingStatus.choices,
        default=ListingStatus.DRAFT,
        db_index=True
    )
    is_featured = models.BooleanField(default=False, db_index=True)
    is_trending = models.BooleanField(default=False)
    
    # Engagement Metrics
    views_count = models.IntegerField(default=0)
    wishlist_count = models.IntegerField(default=0)
    cart_add_count = models.IntegerField(default=0)
    sales_count = models.IntegerField(default=0)
    
    # Rating
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    review_count = models.IntegerField(default=0)
    
    # Availability
    available_from = models.DateField(null=True, blank=True)
    available_until = models.DateField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Audit
    last_restocked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_crop_products'
        unique_together = [['farmer', 'slug']]
        indexes = [
            models.Index(fields=['farmer', '-created_at']),
            models.Index(fields=['category', 'listing_status']),
            models.Index(fields=['listing_status', '-rating']),
            models.Index(fields=['price_per_unit']),
            models.Index(fields=['-is_featured', '-rating']),
        ]

    def __str__(self):
        return f"{self.name} - {self.farmer.farm_name}"

    @property
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price_per_unit:
            return round(((self.original_price - self.price_per_unit) / self.original_price) * 100, 2)
        return 0


# ============================================================================
# PRODUCT IMAGES
# ============================================================================

class ProductImage(TimeStampedModel):
    """Product images with CDN optimization"""
    product = models.ForeignKey(CropProduct, on_delete=models.CASCADE, related_name='images')
    
    # Image file
    image = models.ImageField(upload_to='marketplace/products/gallery/', blank=True, null=True)
    
    # URLs
    original_url = models.URLField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    medium_url = models.URLField(blank=True)
    large_url = models.URLField(blank=True)
    webp_url = models.URLField(blank=True)
    
    # Metadata
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    format = models.CharField(max_length=10, blank=True)
    
    # Display
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'marketplace_product_images'
        ordering = ['display_order']
        indexes = [
            models.Index(fields=['product', 'display_order']),
        ]

    def __str__(self):
        return f"Image for {self.product.name}"


# ============================================================================
# SHOPPING CART
# ============================================================================

class CartItem(TimeStampedModel):
    """Shopping cart with session support"""
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, null=True, blank=True, related_name='cart_items')
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    product = models.ForeignKey(CropProduct, on_delete=models.CASCADE)
    
    quantity = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(0.001)])
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)  # Snapshot
    
    # Metadata
    added_via = models.CharField(max_length=50, default='web')
    expires_at = models.DateTimeField(db_index=True)

    class Meta:
        db_table = 'marketplace_cart_items'
        unique_together = [['buyer', 'product']]
        indexes = [
            models.Index(fields=['buyer', 'expires_at']),
            models.Index(fields=['session_id', 'expires_at']),
        ]

    def __str__(self):
        return f"Cart: {self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        return self.quantity * self.unit_price


# ============================================================================
# ORDERS
# ============================================================================

class Order(TimeStampedModel):
    """Comprehensive order management"""
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Parties
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.PROTECT, related_name='orders')
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.PROTECT, related_name='orders')
    product = models.ForeignKey(CropProduct, on_delete=models.PROTECT)
    
    # Order Details
    quantity_ordered = models.DecimalField(max_digits=10, decimal_places=3, validators=[MinValueValidator(0.001)])
    unit = models.CharField(max_length=20, choices=Unit.choices)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Pricing Breakdown
    subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packaging_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Discount Info
    coupon_code = models.CharField(max_length=50, blank=True)
    discount_type = models.CharField(max_length=20, blank=True)
    
    # Order Status
    order_status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True
    )
    status_updated_at = models.DateTimeField(auto_now=True)
    
    # Payment
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.UNPAID,
        db_index=True
    )
    payment_method = models.CharField(max_length=50, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_gateway = models.CharField(max_length=50, blank=True)
    payment_gateway_order_id = models.CharField(max_length=100, blank=True)
    payment_gateway_response = models.JSONField(default=dict, blank=True)
    
    # Delivery Address (Snapshot)
    delivery_name = models.CharField(max_length=255)
    delivery_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)
    delivery_state = models.CharField(max_length=100)
    delivery_pincode = models.CharField(max_length=10)
    delivery_landmark = models.CharField(max_length=255, blank=True)
    
    # Logistics
    estimated_delivery_date = models.DateField(null=True, blank=True)
    actual_delivery_date = models.DateField(null=True, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True, db_index=True)
    courier_partner = models.CharField(max_length=100, blank=True)
    courier_awb_number = models.CharField(max_length=100, blank=True)
    shipping_label_url = models.URLField(blank=True)
    
    # Additional Info
    buyer_notes = models.TextField(blank=True)
    farmer_notes = models.TextField(blank=True)
    special_instructions = models.TextField(blank=True)
    
    # Cancellation/Return
    cancellation_reason = models.TextField(blank=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_orders')
    cancelled_at = models.DateTimeField(null=True, blank=True)
    refund_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    refund_transaction_id = models.CharField(max_length=100, blank=True)
    refund_date = models.DateTimeField(null=True, blank=True)
    return_reason = models.TextField(blank=True)
    return_approved = models.BooleanField(null=True, blank=True)
    
    # Quality Assurance
    quality_check_passed = models.BooleanField(null=True, blank=True)
    quality_check_notes = models.TextField(blank=True)
    quality_checked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='quality_checked_orders')
    quality_checked_at = models.DateTimeField(null=True, blank=True)
    
    # Communication
    last_notification_sent_at = models.DateTimeField(null=True, blank=True)
    notification_count = models.IntegerField(default=0)
    
    # Timestamps
    placed_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['buyer', '-created_at']),
            models.Index(fields=['farmer', '-created_at']),
            models.Index(fields=['order_status', '-created_at']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['estimated_delivery_date']),
        ]

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number
            from django.utils import timezone
            import random
            year = timezone.now().year
            random_num = random.randint(100000, 999999)
            self.order_number = f"ORD-{year}-{random_num}"
        super().save(*args, **kwargs)


# ============================================================================
# ORDER STATUS HISTORY
# ============================================================================

class OrderStatusHistory(TimeStampedModel):
    """Audit trail for order status changes"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=20, choices=OrderStatus.choices, blank=True)
    to_status = models.CharField(max_length=20, choices=OrderStatus.choices)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'marketplace_order_status_history'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', '-created_at']),
        ]

    def __str__(self):
        return f"{self.order.order_number}: {self.from_status} → {self.to_status}"


# ============================================================================
# RECEIPTS/INVOICES
# ============================================================================

class Receipt(TimeStampedModel):
    """Tax-compliant invoices"""
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(max_length=50, unique=True, db_index=True)
    invoice_date = models.DateField()
    
    # Tax Details
    hsn_code = models.CharField(max_length=20, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Amounts
    subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    amount_in_words = models.TextField(blank=True)
    
    # Files
    pdf_url = models.URLField(blank=True)
    pdf_generated_at = models.DateTimeField(null=True, blank=True)
    
    # Digital Signature
    is_digitally_signed = models.BooleanField(default=False)
    signature_hash = models.CharField(max_length=255, blank=True)
    
    # Compliance
    irn = models.CharField(max_length=100, blank=True)  # Invoice Reference Number
    ack_number = models.CharField(max_length=100, blank=True)
    qr_code_data = models.TextField(blank=True)
    
    sent_to_buyer_at = models.DateTimeField(null=True, blank=True)
    downloaded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_receipts'
        indexes = [
            models.Index(fields=['receipt_number']),
            models.Index(fields=['-invoice_date']),
        ]

    def __str__(self):
        return f"Receipt {self.receipt_number}"


# Continuing with Reviews, Ratings, Wishlist, Notifications, Coupons...


# ============================================================================
# REVIEWS & RATINGS
# ============================================================================

class ProductReview(TimeStampedModel):
    """Product reviews with moderation"""
    product = models.ForeignKey(CropProduct, on_delete=models.CASCADE, related_name='reviews')
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Rating
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Detailed Ratings
    quality_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    packaging_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    freshness_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    value_for_money_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Review
    title = models.CharField(max_length=255, blank=True)
    review_text = models.TextField(blank=True)
    
    # Verification
    is_verified_purchase = models.BooleanField(default=False)
    
    # Media
    review_images = models.JSONField(default=list, blank=True)
    
    # Engagement
    helpful_count = models.IntegerField(default=0)
    reported_count = models.IntegerField(default=0)
    
    # Moderation
    is_approved = models.BooleanField(default=False, db_index=True)
    is_flagged = models.BooleanField(default=False, db_index=True)
    moderated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_reviews')
    moderation_notes = models.TextField(blank=True)
    moderated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_product_reviews'
        unique_together = [['buyer', 'product', 'order']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'is_approved', '-created_at']),
            models.Index(fields=['buyer']),
            models.Index(fields=['rating', '-created_at']),
        ]

    def __str__(self):
        return f"Review by {self.buyer.user.get_full_name()} for {self.product.name}"


class FarmerRating(TimeStampedModel):
    """Seller reputation ratings"""
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name='farmer_ratings')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Overall Rating
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Detailed Ratings
    communication_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    product_quality_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    delivery_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    responsiveness_rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    feedback_text = models.TextField(blank=True)

    class Meta:
        db_table = 'marketplace_farmer_ratings'
        unique_together = [['buyer', 'farmer', 'order']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['farmer', '-created_at']),
            models.Index(fields=['rating', '-created_at']),
        ]

    def __str__(self):
        return f"Rating for {self.farmer.farm_name} by {self.buyer.user.get_full_name()}"


# ============================================================================
# WISHLIST
# ============================================================================

class Wishlist(TimeStampedModel):
    """Buyer wishlist"""
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(CropProduct, on_delete=models.CASCADE, related_name='wishlisted_by')
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'marketplace_wishlists'
        unique_together = [['buyer', 'product']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['buyer', '-created_at']),
            models.Index(fields=['product']),
        ]

    def __str__(self):
        return f"{self.buyer.user.get_full_name()}'s wishlist: {self.product.name}"


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationType(models.TextChoices):
    ORDER_PLACED = 'order_placed', _('Order Placed')
    ORDER_CONFIRMED = 'order_confirmed', _('Order Confirmed')
    ORDER_SHIPPED = 'order_shipped', _('Order Shipped')
    ORDER_DELIVERED = 'order_delivered', _('Order Delivered')
    ORDER_CANCELLED = 'order_cancelled', _('Order Cancelled')
    PAYMENT_RECEIVED = 'payment_received', _('Payment Received')
    PAYMENT_FAILED = 'payment_failed', _('Payment Failed')
    LOW_STOCK = 'low_stock', _('Low Stock')
    OUT_OF_STOCK = 'out_of_stock', _('Out of Stock')
    PRODUCT_BACK_IN_STOCK = 'product_back_in_stock', _('Product Back in Stock')
    NEW_REVIEW = 'new_review', _('New Review')
    PRICE_DROP = 'price_drop', _('Price Drop')
    NEW_MESSAGE = 'new_message', _('New Message')
    VERIFICATION_APPROVED = 'verification_approved', _('Verification Approved')
    VERIFICATION_REJECTED = 'verification_rejected', _('Verification Rejected')
    PROMOTIONAL = 'promotional', _('Promotional')
    SYSTEM_ALERT = 'system_alert', _('System Alert')


class NotificationPriority(models.TextChoices):
    LOW = 'low', _('Low')
    MEDIUM = 'medium', _('Medium')
    HIGH = 'high', _('High')
    URGENT = 'urgent', _('Urgent')


class Notification(TimeStampedModel):
    """Multi-channel notifications"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='marketplace_notifications')
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices)
    priority = models.CharField(max_length=10, choices=NotificationPriority.choices, default=NotificationPriority.MEDIUM)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Rich content
    action_url = models.URLField(blank=True)
    action_text = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Related entities
    related_order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    related_product = models.ForeignKey(CropProduct, on_delete=models.CASCADE, null=True, blank=True)
    
    # Delivery status
    channels_sent = models.JSONField(default=list, blank=True)  # ['in_app', 'email', 'sms']
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Scheduling
    scheduled_for = models.DateTimeField(null=True, blank=True, db_index=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'marketplace_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
            models.Index(fields=['notification_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.user.get_full_name()}"


# ============================================================================
# COUPONS & PROMOTIONS
# ============================================================================

class DiscountType(models.TextChoices):
    PERCENTAGE = 'percentage', _('Percentage')
    FIXED_AMOUNT = 'fixed_amount', _('Fixed Amount')
    FREE_SHIPPING = 'free_shipping', _('Free Shipping')
    BUY_X_GET_Y = 'buy_x_get_y', _('Buy X Get Y')


class CouponUserType(models.TextChoices):
    ALL = 'all', _('All Users')
    NEW_USERS = 'new_users', _('New Users')
    EXISTING_USERS = 'existing_users', _('Existing Users')
    SPECIFIC_USERS = 'specific_users', _('Specific Users')


class Coupon(TimeStampedModel):
    """Promotional coupons"""
    code = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Discount Details
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Conditions
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_uses_per_user = models.IntegerField(default=1)
    total_usage_limit = models.IntegerField(null=True, blank=True)
    
    # Applicability
    applicable_to = models.CharField(max_length=20, choices=CouponUserType.choices, default=CouponUserType.ALL)
    applicable_categories = models.JSONField(default=list, blank=True)
    applicable_products = models.JSONField(default=list, blank=True)
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Metadata
    description = models.TextField(blank=True)
    terms_and_conditions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_coupons')

    class Meta:
        db_table = 'marketplace_coupons'
        indexes = [
            models.Index(fields=['code', 'is_active']),
            models.Index(fields=['valid_from', 'valid_until']),
        ]

    def __str__(self):
        return f"Coupon: {self.code}"

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_until


class CouponUsage(TimeStampedModel):
    """Track coupon usage"""
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='usages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coupon_usages')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='coupon_usage')
    discount_applied = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'marketplace_coupon_usages'
        indexes = [
            models.Index(fields=['coupon', 'user']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.coupon.code} used by {self.user.get_full_name()}"


# ============================================================================
# ANALYTICS & METRICS (For Performance Tracking)
# ============================================================================

class DailyMetrics(models.Model):
    """Daily aggregated metrics for performance monitoring"""
    date = models.DateField(unique=True, db_index=True)
    
    # Order Metrics
    total_orders = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    avg_order_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # User Metrics
    new_farmers = models.IntegerField(default=0)
    new_buyers = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    
    # Product Metrics
    new_listings = models.IntegerField(default=0)
    total_active_listings = models.IntegerField(default=0)
    
    # Engagement Metrics
    total_views = models.IntegerField(default=0)
    total_cart_adds = models.IntegerField(default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'marketplace_daily_metrics'
        ordering = ['-date']

    def __str__(self):
        return f"Metrics for {self.date}"
