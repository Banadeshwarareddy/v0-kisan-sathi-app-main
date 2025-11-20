"""
API URL Configuration for Marketplace
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerProfileViewSet, BuyerProfileViewSet, DeliveryAddressViewSet,
    CropCategoryViewSet, CropProductViewSet,
    CartItemViewSet, OrderViewSet,
    ProductReviewViewSet, WishlistViewSet,
    NotificationViewSet, CouponViewSet
)

# API Router for REST endpoints
router = DefaultRouter()
router.register(r'farmers', FarmerProfileViewSet, basename='farmer')
router.register(r'buyers', BuyerProfileViewSet, basename='buyer')
router.register(r'delivery-addresses', DeliveryAddressViewSet, basename='delivery-address')
router.register(r'categories', CropCategoryViewSet, basename='category')
router.register(r'products', CropProductViewSet, basename='product')
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ProductReviewViewSet, basename='review')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'coupons', CouponViewSet, basename='coupon')

urlpatterns = [
    path('', include(router.urls)),
]
