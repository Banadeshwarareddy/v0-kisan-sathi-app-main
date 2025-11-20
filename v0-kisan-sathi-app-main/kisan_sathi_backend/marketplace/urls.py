"""
Template URL Configuration for Marketplace
"""
from django.urls import path
from .views import (
    marketplace_home, products_list, product_detail,
    cart_view, checkout_view, farmer_dashboard,
    buyer_dashboard, wishlist_view, add_product
)

app_name = 'marketplace'

urlpatterns = [
    path('', marketplace_home, name='home'),
    path('products/', products_list, name='products'),
    path('products/<uuid:product_id>/', product_detail, name='product_detail'),
    path('cart/', cart_view, name='cart'),
    path('checkout/', checkout_view, name='checkout'),
    path('farmer/dashboard/', farmer_dashboard, name='farmer_dashboard'),
    path('farmer/add-product/', add_product, name='add_product'),
    path('buyer/dashboard/', buyer_dashboard, name='buyer_dashboard'),
    path('wishlist/', wishlist_view, name='wishlist'),
]
