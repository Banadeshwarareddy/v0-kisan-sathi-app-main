/**
 * KISAN MARKETPLACE - PRODUCTS LIST PAGE
 * Advanced filtering, sorting, search, and pagination
 */

// State management
let currentFilters = {
    search: '',
    category: null,
    min_price: null,
    max_price: null,
    quality_grade: [],
    is_organic_certified: false,
    is_fssai_approved: false,
    state: '',
    district: '',
    in_stock: true,
    ordering: '-created_at',
    page: 1,
    page_size: 20
};

let categories = [];
let totalResults = 0;
let totalPages = 0;

// Debounce timer for search
let searchDebounceTimer = null;

// ============================================================================
// INITIALIZE PAGE
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category')) {
        currentFilters.category = urlParams.get('category');
    }
    if (urlParams.get('search')) {
        currentFilters.search = urlParams.get('search');
        document.getElementById('search-input').value = currentFilters.search;
    }
    if (urlParams.get('featured') === 'true') {
        currentFilters.is_featured = true;
    }
    if (urlParams.get('trending') === 'true') {
        currentFilters.is_trending = true;
    }
    
    await loadProducts();
});

// ============================================================================
// LOAD CATEGORIES
// ============================================================================

async function loadCategories() {
    try {
        const response = await fetchCategories();
        categories = response.results || response;
        
        const container = document.getElementById('category-filters');
        if (categories && categories.length > 0) {
            container.innerHTML = categories.map(cat => `
                <div class="filter-option">
                    <input type="radio" 
                           name="category" 
                           id="cat-${cat.id}" 
                           value="${cat.id}"
                           ${currentFilters.category == cat.id ? 'checked' : ''}
                           onchange="applyFilters()">
                    <label for="cat-${cat.id}">${cat.name}</label>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ============================================================================
// LOAD PRODUCTS
// ============================================================================

async function loadProducts() {
    try {
        showLoading();
        
        // Build filter object
        const filters = {};
        if (currentFilters.search) filters.search = currentFilters.search;
        if (currentFilters.category) filters.category = currentFilters.category;
        if (currentFilters.min_price) filters.min_price = currentFilters.min_price;
        if (currentFilters.max_price) filters.max_price = currentFilters.max_price;
        if (currentFilters.state) filters.state = currentFilters.state;
        if (currentFilters.district) filters.district = currentFilters.district;
        if (currentFilters.is_organic_certified) filters.is_organic_certified = true;
        if (currentFilters.is_fssai_approved) filters.is_fssai_approved = true;
        if (currentFilters.quality_grade.length > 0) {
            filters.quality_grade = currentFilters.quality_grade.join(',');
        }
        if (currentFilters.ordering) filters.ordering = currentFilters.ordering;
        filters.page = currentFilters.page;
        filters.page_size = currentFilters.page_size;
        
        const response = await fetchProducts(filters);
        
        hideLoading();
        
        totalResults = response.count || 0;
        totalPages = Math.ceil(totalResults / currentFilters.page_size);
        
        displayProducts(response.results || []);
        updateResultsCount();
        updatePagination();
        updateActiveFilters();
        
    } catch (error) {
        hideLoading();
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
        displayEmptyState();
    }
}

// ============================================================================
// DISPLAY PRODUCTS
// ============================================================================

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        displayEmptyState();
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function displayEmptyState() {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
            <div class="empty-state-icon">📦</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No products found</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                Try adjusting your filters or search terms
            </p>
            <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
        </div>
    `;
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
                
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    ${product.quantity_available > 0 ? 
                        `✓ ${product.quantity_available} ${product.unit} available` : 
                        '✗ Out of stock'}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-cart" 
                            onclick="event.stopPropagation(); handleAddToCart('${product.id}', '${product.name}')"
                            ${product.quantity_available <= 0 ? 'disabled' : ''}>
                        ${product.quantity_available > 0 ? 'Add to Cart' : 'Out of Stock'}
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
// FILTERS
// ============================================================================

function applyFilters() {
    // Get all filter values
    currentFilters.search = document.getElementById('search-input').value.trim();
    currentFilters.min_price = document.getElementById('min-price').value || null;
    currentFilters.max_price = document.getElementById('max-price').value || null;
    currentFilters.state = document.getElementById('state-filter').value;
    currentFilters.district = document.getElementById('district-filter').value.trim();
    currentFilters.is_organic_certified = document.getElementById('organic').checked;
    currentFilters.is_fssai_approved = document.getElementById('fssai').checked;
    currentFilters.in_stock = document.getElementById('in-stock').checked;
    
    // Get selected category
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    currentFilters.category = selectedCategory ? selectedCategory.value : null;
    
    // Get quality grades
    currentFilters.quality_grade = [];
    if (document.getElementById('quality-premium').checked) currentFilters.quality_grade.push('premium');
    if (document.getElementById('quality-a').checked) currentFilters.quality_grade.push('grade_a');
    if (document.getElementById('quality-b').checked) currentFilters.quality_grade.push('grade_b');
    
    // Reset to page 1
    currentFilters.page = 1;
    
    // Reload products
    loadProducts();
    
    // Close mobile filters
    if (window.innerWidth <= 1024) {
        toggleFilters();
    }
}

function clearAllFilters() {
    // Reset all filters
    currentFilters = {
        search: '',
        category: null,
        min_price: null,
        max_price: null,
        quality_grade: [],
        is_organic_certified: false,
        is_fssai_approved: false,
        state: '',
        district: '',
        in_stock: true,
        ordering: '-created_at',
        page: 1,
        page_size: 20
    };
    
    // Reset form inputs
    document.getElementById('search-input').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('state-filter').value = '';
    document.getElementById('district-filter').value = '';
    document.getElementById('organic').checked = false;
    document.getElementById('fssai').checked = false;
    document.getElementById('in-stock').checked = true;
    document.getElementById('quality-premium').checked = false;
    document.getElementById('quality-a').checked = false;
    document.getElementById('quality-b').checked = false;
    
    // Uncheck category radios
    document.querySelectorAll('input[name="category"]').forEach(radio => radio.checked = false);
    
    // Reload products
    loadProducts();
}

// ============================================================================
// SEARCH
// ============================================================================

function debounceSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        applyFilters();
    }, 500);
}

// ============================================================================
// SORTING
// ============================================================================

function applySort(sortType) {
    const sortMap = {
        'relevance': '-created_at',
        'price_low': 'price_per_unit',
        'price_high': '-price_per_unit',
        'rating': '-rating',
        'newest': '-created_at'
    };
    
    currentFilters.ordering = sortMap[sortType] || '-created_at';
    currentFilters.page = 1;
    
    // Update active sort option
    document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');
    
    loadProducts();
}

// ============================================================================
// PAGINATION
// ============================================================================

function updatePagination() {
    const container = document.getElementById('pagination-container');
    
    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    
    let paginationHTML = `
        <button onclick="goToPage(${currentFilters.page - 1})" ${currentFilters.page === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Show page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentFilters.page - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<span class="page-number" onclick="goToPage(1)">1</span>`;
        if (startPage > 2) paginationHTML += `<span>...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <span class="page-number ${i === currentFilters.page ? 'active' : ''}" 
                  onclick="goToPage(${i})">${i}</span>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<span>...</span>`;
        paginationHTML += `<span class="page-number" onclick="goToPage(${totalPages})">${totalPages}</span>`;
    }
    
    paginationHTML += `
        <button onclick="goToPage(${currentFilters.page + 1})" ${currentFilters.page === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    container.innerHTML = paginationHTML;
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentFilters.page = page;
    loadProducts();
    scrollToTop();
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateResultsCount() {
    const countElement = document.getElementById('results-count');
    countElement.textContent = `${totalResults} product${totalResults !== 1 ? 's' : ''} found`;
}

function updateActiveFilters() {
    const container = document.getElementById('active-filters');
    const filters = [];
    
    if (currentFilters.search) {
        filters.push({ label: `Search: "${currentFilters.search}"`, key: 'search' });
    }
    if (currentFilters.category) {
        const cat = categories.find(c => c.id == currentFilters.category);
        if (cat) filters.push({ label: cat.name, key: 'category' });
    }
    if (currentFilters.min_price || currentFilters.max_price) {
        const priceLabel = `₹${currentFilters.min_price || '0'} - ₹${currentFilters.max_price || '∞'}`;
        filters.push({ label: priceLabel, key: 'price' });
    }
    if (currentFilters.state) {
        filters.push({ label: currentFilters.state, key: 'state' });
    }
    if (currentFilters.is_organic_certified) {
        filters.push({ label: 'Organic', key: 'organic' });
    }
    
    if (filters.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filters.map(filter => `
        <span class="filter-chip">
            ${filter.label}
            <button onclick="removeFilter('${filter.key}')">×</button>
        </span>
    `).join('');
}

function removeFilter(key) {
    switch(key) {
        case 'search':
            currentFilters.search = '';
            document.getElementById('search-input').value = '';
            break;
        case 'category':
            currentFilters.category = null;
            document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false);
            break;
        case 'price':
            currentFilters.min_price = null;
            currentFilters.max_price = null;
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            break;
        case 'state':
            currentFilters.state = '';
            document.getElementById('state-filter').value = '';
            break;
        case 'organic':
            currentFilters.is_organic_certified = false;
            document.getElementById('organic').checked = false;
            break;
    }
    loadProducts();
}

function toggleFilters() {
    const sidebar = document.getElementById('filters-sidebar');
    const overlay = document.querySelector('.filter-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// ============================================================================
// CART & WISHLIST
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
    }
}

async function handleAddToWishlist(productId, productName) {
    try {
        showLoading();
        await addToWishlist(productId);
        hideLoading();
        showToast(`${productName} added to wishlist!`, 'success');
    } catch (error) {
        hideLoading();
        showToast('Failed to add to wishlist. Please login first.', 'error');
    }
}
