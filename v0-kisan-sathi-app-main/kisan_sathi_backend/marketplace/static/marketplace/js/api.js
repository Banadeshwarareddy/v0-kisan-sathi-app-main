/**
 * KISAN MARKETPLACE - API INTEGRATION
 * Fetch API calls to Django REST endpoints
 */

// API Base URL
const API_BASE_URL = '/api/marketplace';

// ============================================================================
// API REQUEST HELPER
// ============================================================================

/**
 * Make API request with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return null;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================================================
// PRODUCTS API
// ============================================================================

/**
 * Fetch products with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Products data
 */
async function fetchProducts(filters = {}) {
    const queryString = buildQueryString(filters);
    return await apiRequest(`/products/${queryString}`);
}

/**
 * Fetch single product details
 * @param {string} productId - Product UUID
 * @returns {Promise} Product data
 */
async function fetchProductDetails(productId) {
    return await apiRequest(`/products/${productId}/`);
}

/**
 * Fetch featured products
 * @returns {Promise} Featured products
 */
async function fetchFeaturedProducts() {
    return await apiRequest('/products/featured/');
}

/**
 * Fetch trending products
 * @returns {Promise} Trending products
 */
async function fetchTrendingProducts() {
    return await apiRequest('/products/trending/');
}

/**
 * Fetch product reviews
 * @param {string} productId - Product UUID
 * @returns {Promise} Reviews data
 */
async function fetchProductReviews(productId) {
    return await apiRequest(`/products/${productId}/reviews/`);
}

// ============================================================================
// CATEGORIES API
// ============================================================================

/**
 * Fetch all categories
 * @returns {Promise} Categories data
 */
async function fetchCategories() {
    return await apiRequest('/categories/');
}

/**
 * Fetch category tree
 * @returns {Promise} Category tree data
 */
async function fetchCategoryTree() {
    return await apiRequest('/categories/tree/');
}

// ============================================================================
// CART API
// ============================================================================

/**
 * Fetch cart items
 * @returns {Promise} Cart data
 */
async function fetchCart() {
    return await apiRequest('/cart/');
}

/**
 * Get cart summary
 * @returns {Promise} Cart summary
 */
async function fetchCartSummary() {
    return await apiRequest('/cart/summary/');
}

/**
 * Add item to cart
 * @param {string} productId - Product UUID
 * @param {number} quantity - Quantity
 * @returns {Promise} Cart item data
 */
async function addToCart(productId, quantity = 1) {
    return await apiRequest('/cart/', {
        method: 'POST',
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    });
}

/**
 * Update cart item quantity
 * @param {string} cartItemId - Cart item UUID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart item
 */
async function updateCartItem(cartItemId, quantity) {
    return await apiRequest(`/cart/${cartItemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
    });
}

/**
 * Remove item from cart
 * @param {string} cartItemId - Cart item UUID
 * @returns {Promise} Response
 */
async function removeFromCart(cartItemId) {
    return await apiRequest(`/cart/${cartItemId}/`, {
        method: 'DELETE'
    });
}

/**
 * Clear entire cart
 * @returns {Promise} Response
 */
async function clearCart() {
    return await apiRequest('/cart/clear/', {
        method: 'POST'
    });
}

// ============================================================================
// ORDERS API
// ============================================================================

/**
 * Fetch user orders
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Orders data
 */
async function fetchOrders(filters = {}) {
    const queryString = buildQueryString(filters);
    return await apiRequest(`/orders/${queryString}`);
}

/**
 * Fetch single order details
 * @param {string} orderId - Order UUID
 * @returns {Promise} Order data
 */
async function fetchOrderDetails(orderId) {
    return await apiRequest(`/orders/${orderId}/`);
}

/**
 * Create new order
 * @param {Object} orderData - Order data
 * @returns {Promise} Created order
 */
async function createOrder(orderData) {
    return await apiRequest('/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

/**
 * Confirm order (farmer action)
 * @param {string} orderId - Order UUID
 * @returns {Promise} Response
 */
async function confirmOrder(orderId) {
    return await apiRequest(`/orders/${orderId}/confirm/`, {
        method: 'POST'
    });
}

/**
 * Cancel order
 * @param {string} orderId - Order UUID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} Response
 */
async function cancelOrder(orderId, reason) {
    return await apiRequest(`/orders/${orderId}/cancel/`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    });
}

// ============================================================================
// WISHLIST API
// ============================================================================

/**
 * Fetch wishlist
 * @returns {Promise} Wishlist data
 */
async function fetchWishlist() {
    return await apiRequest('/wishlist/');
}

/**
 * Add to wishlist
 * @param {string} productId - Product UUID
 * @param {string} notes - Optional notes
 * @returns {Promise} Wishlist item
 */
async function addToWishlist(productId, notes = '') {
    return await apiRequest('/wishlist/', {
        method: 'POST',
        body: JSON.stringify({
            product_id: productId,
            notes: notes
        })
    });
}

/**
 * Remove from wishlist
 * @param {string} wishlistItemId - Wishlist item UUID
 * @returns {Promise} Response
 */
async function removeFromWishlist(wishlistItemId) {
    return await apiRequest(`/wishlist/${wishlistItemId}/`, {
        method: 'DELETE'
    });
}

// ============================================================================
// REVIEWS API
// ============================================================================

/**
 * Submit product review
 * @param {Object} reviewData - Review data
 * @returns {Promise} Created review
 */
async function submitReview(reviewData) {
    return await apiRequest('/reviews/', {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
}

// ============================================================================
// DELIVERY ADDRESSES API
// ============================================================================

/**
 * Fetch delivery addresses
 * @returns {Promise} Addresses data
 */
async function fetchDeliveryAddresses() {
    return await apiRequest('/delivery-addresses/');
}

/**
 * Add delivery address
 * @param {Object} addressData - Address data
 * @returns {Promise} Created address
 */
async function addDeliveryAddress(addressData) {
    return await apiRequest('/delivery-addresses/', {
        method: 'POST',
        body: JSON.stringify(addressData)
    });
}

/**
 * Update delivery address
 * @param {string} addressId - Address UUID
 * @param {Object} addressData - Updated address data
 * @returns {Promise} Updated address
 */
async function updateDeliveryAddress(addressId, addressData) {
    return await apiRequest(`/delivery-addresses/${addressId}/`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
    });
}

/**
 * Delete delivery address
 * @param {string} addressId - Address UUID
 * @returns {Promise} Response
 */
async function deleteDeliveryAddress(addressId) {
    return await apiRequest(`/delivery-addresses/${addressId}/`, {
        method: 'DELETE'
    });
}

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

/**
 * Fetch notifications
 * @returns {Promise} Notifications data
 */
async function fetchNotifications() {
    return await apiRequest('/notifications/');
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification UUID
 * @returns {Promise} Response
 */
async function markNotificationRead(notificationId) {
    return await apiRequest(`/notifications/${notificationId}/mark_read/`, {
        method: 'POST'
    });
}

/**
 * Mark all notifications as read
 * @returns {Promise} Response
 */
async function markAllNotificationsRead() {
    return await apiRequest('/notifications/mark_all_read/', {
        method: 'POST'
    });
}

// ============================================================================
// COUPONS API
// ============================================================================

/**
 * Validate coupon code
 * @param {string} code - Coupon code
 * @returns {Promise} Coupon data
 */
async function validateCoupon(code) {
    return await apiRequest('/coupons/validate/', {
        method: 'POST',
        body: JSON.stringify({ code })
    });
}

// ============================================================================
// FARMER PROFILE API
// ============================================================================

/**
 * Fetch farmer profile
 * @param {string} farmerId - Farmer UUID
 * @returns {Promise} Farmer data
 */
async function fetchFarmerProfile(farmerId) {
    return await apiRequest(`/farmers/${farmerId}/`);
}

/**
 * Fetch farmer products
 * @param {string} farmerId - Farmer UUID
 * @returns {Promise} Products data
 */
async function fetchFarmerProducts(farmerId) {
    return await apiRequest(`/farmers/${farmerId}/products/`);
}

/**
 * Fetch farmer stats
 * @param {string} farmerId - Farmer UUID
 * @returns {Promise} Stats data
 */
async function fetchFarmerStats(farmerId) {
    return await apiRequest(`/farmers/${farmerId}/stats/`);
}

// ============================================================================
// BUYER PROFILE API
// ============================================================================

/**
 * Fetch buyer profile
 * @returns {Promise} Buyer data
 */
async function fetchBuyerProfile() {
    return await apiRequest('/buyers/');
}

/**
 * Update buyer profile
 * @param {string} buyerId - Buyer UUID
 * @param {Object} profileData - Profile data
 * @returns {Promise} Updated profile
 */
async function updateBuyerProfile(buyerId, profileData) {
    return await apiRequest(`/buyers/${buyerId}/`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
}
