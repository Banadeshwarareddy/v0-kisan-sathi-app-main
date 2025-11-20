/**
 * KISAN MARKETPLACE - HOME PAGE
 * Load featured products, trending products, and categories
 */

// ============================================================================
// INITIALIZE PAGE
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedProducts();
    await loadTrendingProducts();
    await loadCategories();
    await loadStats();
});

// ============================================================================
// LOAD FEATURED PRODUCTS
// ============================================================================

async function loadFeaturedProducts() {
    try {
        const products = await fetchFeaturedProducts();
        const container = document.getElementById('featured-products');
        
        if (products && products.length > 0) {
            container.innerHTML = products.slice(0, 4).map(product => createProductCard(product)).join('');
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">No featured products available</p>';
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        document.getElementById('featured-products').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Failed to load featured products</p>';
    }
}

// ============================================================================
// LOAD TRENDING PRODUCTS
// ============================================================================

async function loadTrendingProducts() {
    try {
        const products = await fetchTrendingProducts();
        const container = document.getElementById('trending-products');
        
        if (products && products.length > 0) {
            container.innerHTML = products.slice(0, 4).map(product => createProductCard(product)).join('');
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">No trending products available</p>';
        }
    } catch (error) {
        console.error('Error loading trending products:', error);
        document.getElementById('trending-products').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Failed to load trending products</p>';
    }
}

// ============================================================================
// LOAD CATEGORIES
// ============================================================================

async function loadCategories() {
    try {
        const response = await fetchCategories();
        const categories = response.results || response;
        const container = document.getElementById('categories-grid');
        
        if (categories && categories.length > 0) {
            container.innerHTML = categories.slice(0, 8).map(category => `
                <a href="/marketplace/products/?category=${category.id}" 
                   style="background: white; padding: 2rem; border-radius: 0.75rem; text-align: center; text-decoration: none; color: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s;"
                   onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 15px rgba(0,0,0,0.1)'"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${category.icon_url || '🌾'}</div>
                    <div style="font-weight: 600;">${category.name}</div>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ============================================================================
// LOAD STATS
// ============================================================================

async function loadStats() {
    try {
        // Fetch products to get count
        const productsResponse = await fetchProducts({ page_size: 1 });
        if (productsResponse.count) {
            document.getElementById('total-products').textContent = productsResponse.count;
        }
        
        // Mock data for other stats (you can create actual API endpoints for these)
        document.getElementById('total-farmers').textContent = '500+';
        document.getElementById('total-orders').textContent = '10,000+';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================================================
// CREATE PRODUCT CARD
// ============================================================================

function createProductCard(product) {
    const discount = calculateDiscount(product.original_price, product.price_per_unit);
    const imageUrl = product.primary_image_url || getPlaceholderImage(product.name);
    
    return `
        <div class="product-card" onclick="window.location.href='/marketplace/products/${product.id}/'">
            <img src="${imageUrl}" 
                 alt="${product.name}" 
                 class="product-image"
                 onerror="handleImageError(this)">
            <div class="product-body">
                <div class="product-category">${product.category_name || 'Crops'}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-farmer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ${product.farmer_name || 'Farmer'}
                </div>
                
                ${product.rating > 0 ? `
                    <div class="product-rating">
                        <span class="stars">${formatStars(product.rating)}</span>
                        <span class="rating-count">(${product.review_count})</span>
                    </div>
                ` : ''}
                
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price_per_unit)}</span>
                    ${product.original_price && discount > 0 ? `
                        <span class="original-price">${formatPrice(product.original_price)}</span>
                        <span class="discount-badge">${discount}% OFF</span>
                    ` : ''}
                </div>
                
                <div class="product-badges">
                    ${product.is_organic_certified ? '<span class="badge-organic">🌱 Organic</span>' : ''}
                    ${product.quality_grade === 'premium' ? '<span class="badge-certified">⭐ Premium</span>' : ''}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-cart" 
                            onclick="event.stopPropagation(); handleAddToCart('${product.id}', '${product.name}')">
                        Add to Cart
                    </button>
                    <button class="btn-wishlist" 
                            onclick="event.stopPropagation(); handleAddToWishlist('${product.id}', '${product.name}')">
                        ♡
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// HANDLE ADD TO CART
// ============================================================================

async function handleAddToCart(productId, productName) {
    try {
        showLoading();
        await addToCart(productId, 1);
        hideLoading();
        showToast(`${productName} added to cart!`, 'success');
        updateCartCount();
    } catch (error) {
        hideLoading();
        showToast('Failed to add to cart. Please login first.', 'error');
        console.error('Add to cart error:', error);
    }
}

// ============================================================================
// HANDLE ADD TO WISHLIST
// ============================================================================

async function handleAddToWishlist(productId, productName) {
    try {
        showLoading();
        await addToWishlist(productId);
        hideLoading();
        showToast(`${productName} added to wishlist!`, 'success');
    } catch (error) {
        hideLoading();
        showToast('Failed to add to wishlist. Please login first.', 'error');
        console.error('Add to wishlist error:', error);
    }
}
