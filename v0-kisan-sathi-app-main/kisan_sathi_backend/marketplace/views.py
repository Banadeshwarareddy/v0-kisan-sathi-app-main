"""
REST API Views for Marketplace
High-performance views with caching and optimization
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, Sum
from django.utils import timezone
from decimal import Decimal

from .models import (
    FarmerProfile, BuyerProfile, DeliveryAddress,
    CropCategory, CropProduct, ProductImage,
    CartItem, Order, OrderStatusHistory, Receipt,
    ProductReview, FarmerRating, Wishlist,
    Notification, Coupon, CouponUsage
)
from .serializers import (
    FarmerProfileSerializer, FarmerProfileListSerializer,
    BuyerProfileSerializer, DeliveryAddressSerializer,
    CropCategorySerializer, CropProductSerializer, CropProductListSerializer,
    CropProductCreateSerializer, ProductImageSerializer, CartItemSerializer,
    OrderSerializer, OrderListSerializer, ReceiptSerializer,
    ProductReviewSerializer, FarmerRatingSerializer,
    WishlistSerializer, NotificationSerializer,
    CouponSerializer, CreateOrderSerializer
)


# ============================================================================
# PAGINATION
# ============================================================================

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


# ============================================================================
# FARMER PROFILES
# ============================================================================

class FarmerProfileViewSet(viewsets.ModelViewSet):
    """Farmer profile management"""
    queryset = FarmerProfile.objects.select_related('user').all()
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['verification_status', 'state', 'district', 'is_premium']
    search_fields = ['farm_name', 'user__first_name', 'user__last_name', 'district']
    ordering_fields = ['rating', 'total_sales', 'created_at']
    ordering = ['-rating']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FarmerProfileListSerializer
        return FarmerProfileSerializer
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get all products by this farmer"""
        farmer = self.get_object()
        products = CropProduct.objects.filter(
            farmer=farmer,
            listing_status='active',
            is_deleted=False
        )
        serializer = CropProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get farmer statistics"""
        farmer = self.get_object()
        stats = {
            'total_products': farmer.products.filter(is_deleted=False).count(),
            'active_products': farmer.products.filter(listing_status='active', is_deleted=False).count(),
            'total_sales': float(farmer.total_sales),
            'total_orders': farmer.total_orders,
            'rating': float(farmer.rating),
            'review_count': farmer.review_count,
        }
        return Response(stats)


# ============================================================================
# BUYER PROFILES
# ============================================================================

class BuyerProfileViewSet(viewsets.ModelViewSet):
    """Buyer profile management"""
    queryset = BuyerProfile.objects.select_related('user').all()
    serializer_class = BuyerProfileSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        # Users can only see their own profile
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(user=self.request.user)


class DeliveryAddressViewSet(viewsets.ModelViewSet):
    """Delivery address management"""
    queryset = DeliveryAddress.objects.all()
    serializer_class = DeliveryAddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own addresses
        if hasattr(self.request.user, 'buyer_profile'):
            return self.queryset.filter(buyer=self.request.user.buyer_profile, is_active=True)
        return self.queryset.none()
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user.buyer_profile)


# ============================================================================
# CATEGORIES
# ============================================================================

class CropCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Product categories (read-only for users)"""
    queryset = CropCategory.objects.filter(is_active=True).prefetch_related('children')
    serializer_class = CropCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'slug']
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get category tree (root categories with children)"""
        root_categories = self.queryset.filter(parent__isnull=True)
        serializer = self.get_serializer(root_categories, many=True)
        return Response(serializer.data)


# ============================================================================
# PRODUCTS
# ============================================================================

class CropProductViewSet(viewsets.ModelViewSet):
    """Product listing and management"""
    queryset = CropProduct.objects.select_related('farmer', 'category').prefetch_related('images').filter(is_deleted=False)
    permission_classes = [AllowAny]
    pagination_class = LargeResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'listing_status', 'is_organic_certified', 'quality_grade', 'unit']
    search_fields = ['name', 'variety', 'description', 'farmer__farm_name']
    ordering_fields = ['price_per_unit', 'rating', 'created_at', 'sales_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CropProductCreateSerializer
        elif self.action == 'list':
            return CropProductListSerializer
        return CropProductSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        # Ensure user has farmer profile
        if not hasattr(self.request.user, 'farmer_profile'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only farmers can create products")
        serializer.save(farmer=self.request.user.farmer_profile)
    
    def perform_update(self, serializer):
        # Ensure user owns the product
        if serializer.instance.farmer.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own products")
        serializer.save()
    
    def get_queryset(self):
        queryset = self.queryset
        
        # Filter by listing status
        if self.action == 'list':
            queryset = queryset.filter(listing_status='active')
        
        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_unit__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_unit__lte=max_price)
        
        # Location filter
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        if state:
            queryset = queryset.filter(farmer__state=state)
        if district:
            queryset = queryset.filter(farmer__district=district)
        
        # Featured/Trending
        if self.request.query_params.get('featured') == 'true':
            queryset = queryset.filter(is_featured=True)
        if self.request.query_params.get('trending') == 'true':
            queryset = queryset.filter(is_trending=True)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count on product detail"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get product reviews"""
        product = self.get_object()
        reviews = ProductReview.objects.filter(product=product, is_approved=True).order_by('-created_at')
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.queryset.filter(is_featured=True, listing_status='active')[:10]
        serializer = CropProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending products"""
        products = self.queryset.filter(is_trending=True, listing_status='active').order_by('-sales_count')[:10]
        serializer = CropProductListSerializer(products, many=True)
        return Response(serializer.data)


# ============================================================================
# CART
# ============================================================================

class CartItemViewSet(viewsets.ModelViewSet):
    """Shopping cart management"""
    queryset = CartItem.objects.select_related('product', 'buyer').all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'buyer_profile'):
            return self.queryset.filter(
                buyer=self.request.user.buyer_profile,
                expires_at__gt=timezone.now()
            )
        return self.queryset.none()
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'buyer_profile'):
            serializer.save(buyer=self.request.user.buyer_profile)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get cart summary"""
        cart_items = self.get_queryset()
        total = sum(item.subtotal for item in cart_items)
        return Response({
            'item_count': cart_items.count(),
            'subtotal': float(total),
            'items': CartItemSerializer(cart_items, many=True).data
        })
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear cart"""
        self.get_queryset().delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# ORDERS
# ============================================================================

class OrderViewSet(viewsets.ModelViewSet):
    """Order management"""
    queryset = Order.objects.select_related('buyer', 'farmer', 'product').all()
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['order_status', 'payment_status']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        
        # Filter based on user role
        if hasattr(user, 'buyer_profile'):
            queryset = queryset.filter(buyer=user.buyer_profile)
        elif hasattr(user, 'farmer_profile'):
            queryset = queryset.filter(farmer=user.farmer_profile)
        elif not user.is_staff:
            return queryset.none()
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create order from cart/direct purchase"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get validated data
        product = CropProduct.objects.get(id=serializer.validated_data['product_id'])
        quantity = serializer.validated_data['quantity']
        delivery_address = DeliveryAddress.objects.get(id=serializer.validated_data['delivery_address_id'])
        buyer_profile = request.user.buyer_profile
        
        # Calculate pricing
        unit_price = product.price_per_unit
        subtotal = unit_price * quantity
        tax_rate = Decimal('5.00')  # 5% GST
        tax_amount = (subtotal * tax_rate) / 100
        delivery_charges = Decimal('50.00')  # Flat delivery charge
        total_amount = subtotal + tax_amount + delivery_charges
        
        # Create order
        order = Order.objects.create(
            buyer=buyer_profile,
            farmer=product.farmer,
            product=product,
            quantity_ordered=quantity,
            unit=product.unit,
            unit_price=unit_price,
            subtotal=subtotal,
            tax_amount=tax_amount,
            tax_rate=tax_rate,
            delivery_charges=delivery_charges,
            total_amount=total_amount,
            delivery_name=delivery_address.contact_name,
            delivery_phone=delivery_address.contact_phone,
            delivery_address=delivery_address.address_line1,
            delivery_city=delivery_address.city,
            delivery_state=delivery_address.state,
            delivery_pincode=delivery_address.pincode,
            delivery_landmark=delivery_address.landmark,
            payment_method=serializer.validated_data['payment_method'],
            buyer_notes=serializer.validated_data.get('buyer_notes', ''),
        )
        
        # Update product inventory
        product.quantity_available -= quantity
        product.sales_count += 1
        product.save()
        
        # Create status history
        OrderStatusHistory.objects.create(
            order=order,
            to_status='pending',
            changed_by=request.user,
            notes='Order created'
        )
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm order (farmer action)"""
        order = self.get_object()
        if order.order_status == 'pending':
            order.order_status = 'confirmed'
            order.confirmed_at = timezone.now()
            order.save()
            
            OrderStatusHistory.objects.create(
                order=order,
                from_status='pending',
                to_status='confirmed',
                changed_by=request.user,
                notes='Order confirmed by farmer'
            )
            
            return Response({'message': 'Order confirmed'})
        return Response({'error': 'Cannot confirm order'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel order"""
        order = self.get_object()
        reason = request.data.get('reason', '')
        
        if order.order_status in ['pending', 'confirmed']:
            order.order_status = 'cancelled'
            order.cancellation_reason = reason
            order.cancelled_by = request.user
            order.cancelled_at = timezone.now()
            order.save()
            
            # Restore inventory
            order.product.quantity_available += order.quantity_ordered
            order.product.save()
            
            OrderStatusHistory.objects.create(
                order=order,
                from_status=order.order_status,
                to_status='cancelled',
                changed_by=request.user,
                notes=f'Order cancelled: {reason}'
            )
            
            return Response({'message': 'Order cancelled'})
        return Response({'error': 'Cannot cancel order'}, status=status.HTTP_400_BAD_REQUEST)


# ============================================================================
# REVIEWS
# ============================================================================

class ProductReviewViewSet(viewsets.ModelViewSet):
    """Product reviews"""
    queryset = ProductReview.objects.select_related('product', 'buyer').all()
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = self.queryset.filter(is_approved=True)
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'buyer_profile'):
            serializer.save(buyer=self.request.user.buyer_profile)


# ============================================================================
# WISHLIST
# ============================================================================

class WishlistViewSet(viewsets.ModelViewSet):
    """Wishlist management"""
    queryset = Wishlist.objects.select_related('product', 'buyer').all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'buyer_profile'):
            return self.queryset.filter(buyer=self.request.user.buyer_profile)
        return self.queryset.none()
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'buyer_profile'):
            serializer.save(buyer=self.request.user.buyer_profile)


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """User notifications"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'message': 'Marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True, read_at=timezone.now())
        return Response({'message': 'All notifications marked as read'})


# ============================================================================
# COUPONS
# ============================================================================

class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    """Coupon management (read-only for users)"""
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def validate(self, request):
        """Validate coupon code"""
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            if coupon.is_valid():
                return Response({
                    'valid': True,
                    'coupon': CouponSerializer(coupon).data
                })
            return Response({'valid': False, 'message': 'Coupon expired'})
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid coupon code'})


# ============================================================================
# TEMPLATE VIEWS (HTML Pages)
# ============================================================================

from django.shortcuts import render
from django.views.generic import TemplateView

class MarketplaceHomeView(TemplateView):
    """Marketplace home page"""
    template_name = 'marketplace/home.html'

class ProductListView(TemplateView):
    """Product listing page with filters"""
    template_name = 'marketplace/products.html'

class ProductDetailView(TemplateView):
    """Product detail page"""
    template_name = 'marketplace/product_detail.html'

class CartView(TemplateView):
    """Shopping cart page"""
    template_name = 'marketplace/cart.html'

class CheckoutView(TemplateView):
    """Checkout page"""
    template_name = 'marketplace/checkout.html'

class FarmerDashboardView(TemplateView):
    """Farmer dashboard"""
    template_name = 'marketplace/farmer_dashboard.html'

class BuyerDashboardView(TemplateView):
    """Buyer dashboard (orders)"""
    template_name = 'marketplace/buyer_dashboard.html'

class WishlistView(TemplateView):
    """Wishlist page"""
    template_name = 'marketplace/wishlist.html'

# Template view functions
def marketplace_home(request):
    """Marketplace home page"""
    return render(request, 'marketplace/home.html')

def products_list(request):
    """Product listing page"""
    return render(request, 'marketplace/products.html')

def product_detail(request, product_id):
    """Product detail page"""
    return render(request, 'marketplace/product_detail.html', {'product_id': product_id})

def cart_view(request):
    """Shopping cart page"""
    return render(request, 'marketplace/cart.html')

def checkout_view(request):
    """Checkout page"""
    return render(request, 'marketplace/checkout.html')

def farmer_dashboard(request):
    """Farmer dashboard"""
    return render(request, 'marketplace/farmer_dashboard.html')

def add_product(request):
    """Add product page for farmers"""
    return render(request, 'marketplace/add_product.html')

def buyer_dashboard(request):
    """Buyer dashboard"""
    return render(request, 'marketplace/buyer_dashboard.html')

def wishlist_view(request):
    """Wishlist page"""
    return render(request, 'marketplace/wishlist.html')
