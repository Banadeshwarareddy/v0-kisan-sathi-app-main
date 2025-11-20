/**
 * KISAN MARKETPLACE - UTILITY FUNCTIONS
 * Toast notifications, loading spinners, formatters
 */

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div style="font-size: 1.5rem;">${icon}</div>
        <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${getToastTitle(type)}</div>
            <div style="font-size: 0.875rem; color: #6b7280;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 1.25rem; color: #9ca3af;">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getToastTitle(type) {
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    };
    return titles[type] || titles.info;
}

// ============================================================================
// LOADING OVERLAY
// ============================================================================

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// ============================================================================
// FORMATTERS
// ============================================================================

/**
 * Format price in Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price
 */
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format date
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

/**
 * Format rating stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with stars
 */
function formatStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar) stars += '⯨';
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    
    return stars;
}

/**
 * Calculate discount percentage
 * @param {number} original - Original price
 * @param {number} current - Current price
 * @returns {number} Discount percentage
 */
function calculateDiscount(original, current) {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
function getLocalCart() {
    const cart = localStorage.getItem('marketplace_cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items
 */
function saveLocalCart(cart) {
    localStorage.setItem('marketplace_cart', JSON.stringify(cart));
    updateCartCount();
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const cart = getLocalCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Get auth token from localStorage
 * @returns {string|null} JWT token
 */
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 * @param {string} token - JWT token
 */
function setAuthToken(token) {
    localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
function removeAuthToken() {
    localStorage.removeItem('auth_token');
}

// ============================================================================
// URL HELPERS
// ============================================================================

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
function buildQueryString(params) {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    return filtered ? `?${filtered}` : '';
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================================================
// DEBOUNCE
// ============================================================================

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid
 */
function isValidPhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// ============================================================================
// IMAGE HELPERS
// ============================================================================

/**
 * Get placeholder image URL
 * @param {string} text - Text to display
 * @returns {string} Placeholder image URL
 */
function getPlaceholderImage(text = 'No Image') {
    return `https://via.placeholder.com/400x300/10b981/ffffff?text=${encodeURIComponent(text)}`;
}

/**
 * Handle image error
 * @param {HTMLImageElement} img - Image element
 */
function handleImageError(img) {
    img.src = getPlaceholderImage('Image Not Available');
    img.onerror = null; // Prevent infinite loop
}

// ============================================================================
// GLOBAL SEARCH
// ============================================================================

/**
 * Perform global search
 */
function performGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `/marketplace/products/?search=${encodeURIComponent(query)}`;
    }
}

// Add enter key listener for global search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performGlobalSearch();
            }
        });
    }
    
    // Update cart count on page load
    updateCartCount();
});

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @returns {boolean} User confirmation
 */
function confirmAction(message) {
    return confirm(message);
}

// ============================================================================
// SCROLL TO TOP
// ============================================================================

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success', 2000);
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}
