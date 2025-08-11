// ==========================================
// PRODUCTS PAGE JAVASCRIPT
// ==========================================

// Global Variables
let currentPage = 1;
let productsPerPage = 12;
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    category: [],
    fabric: [],
    color: [],
    priceMin: 1000,
    priceMax: 50000,
    search: ''
};
let currentSort = 'default';
let currentView = 'grid';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: 'Royal Silk Wedding Saree',
        category: 'wedding',
        fabric: 'silk',
        color: 'red',
        price: 15000,
        originalPrice: 18000,
        rating: 5,
        reviews: 24,
        images: ['assets/images/product-1.jpg', 'assets/images/product-1-2.jpg'],
        description: 'Exquisite handwoven silk saree perfect for wedding ceremonies. Features intricate gold embroidery and traditional motifs.',
        inStock: true,
        isNew: false,
        badge: 'sale'
    },
    {
        id: 2,
        name: 'Designer Festive Collection',
        category: 'festive',
        fabric: 'georgette',
        color: 'blue',
        price: 8500,
        originalPrice: null,
        rating: 4.8,
        reviews: 18,
        images: ['assets/images/product-2.jpg', 'assets/images/product-2-2.jpg'],
        description: 'Stunning georgette saree with contemporary design elements. Perfect for festive occasions and celebrations.',
        inStock: true,
        isNew: true,
        badge: 'new'
    },
    {
        id: 3,
        name: 'Elegant Casual Cotton',
        category: 'casual',
        fabric: 'cotton',
        color: 'green',
        price: 3500,
        originalPrice: null,
        rating: 4.5,
        reviews: 32,
        images: ['assets/images/product-3.jpg', 'assets/images/product-3-2.jpg'],
        description: 'Comfortable cotton saree for daily wear. Lightweight and breathable with elegant prints.',
        inStock: true,
        isNew: false,
        badge: ''
    },
    {
        id: 4,
        name: 'Premium Bridal Special',
        category: 'wedding',
        fabric: 'silk',
        color: 'red',
        price: 25000,
        originalPrice: 28000,
        rating: 5,
        reviews: 15,
        images: ['assets/images/product-4.jpg', 'assets/images/product-4-2.jpg'],
        description: 'Luxurious bridal saree with heavy embroidery and stone work. Made from pure silk with gold threads.',
        inStock: true,
        isNew: false,
        badge: 'sale'
    },
    {
        id: 5,
        name: 'Chiffon Party Wear',
        category: 'festive',
        fabric: 'chiffon',
        color: 'pink',
        price: 6500,
        originalPrice: null,
        rating: 4.3,
        reviews: 21,
        images: ['assets/images/product-5.jpg', 'assets/images/product-5-2.jpg'],
        description: 'Graceful chiffon saree perfect for parties and social gatherings. Features delicate floral patterns.',
        inStock: true,
        isNew: false,
        badge: ''
    },
    {
        id: 6,
        name: 'Limited Edition Designer',
        category: 'limited',
        fabric: 'silk',
        color: 'purple',
        price: 35000,
        originalPrice: null,
        rating: 4.9,
        reviews: 8,
        images: ['assets/images/product-6.jpg', 'assets/images/product-6-2.jpg'],
        description: 'Exclusive limited edition designer saree. Only 50 pieces available worldwide.',
        inStock: true,
        isNew: true,
        badge: 'limited'
    }
    // Add more products as needed...
];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const sortSelect = document.getElementById('sort-products');
const viewButtons = document.querySelectorAll('.view-btn');
const filterInputs = document.querySelectorAll('input[type="checkbox"]');
const priceSliders = document.querySelectorAll('.slider');
const clearFiltersBtn = document.querySelector('.clear-filters');
const resultsCount = document.getElementById('results-count');
const totalCount = document.getElementById('total-count');

// Virtual Draping Elements
const virtualDrapingBtn = document.getElementById('open-virtual-draping');
const virtualDrapingModal = document.getElementById('virtual-draping-modal');
const quickViewModal = document.getElementById('quick-view-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

function initializeProductsPage() {
    // Load products data
    allProducts = [...sampleProducts];
    filteredProducts = [...allProducts];
    
    // Parse URL parameters
    parseUrlParameters();
    
    // Initialize components
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    initializePagination();
    initializeVirtualDraping();
    initializeQuickView();
    
    // Render initial products
    renderProducts();
    updateResultsCount();
}

function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Category filter from URL
    const category = urlParams.get('category');
    if (category) {
        currentFilters.category = [category];
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    // Search query from URL
    const search = urlParams.get('search');
    if (search) {
        currentFilters.search = search;
    }
}

// ==========================================
// FILTERS
// ==========================================
function initializeFilters() {
    // Category and other checkbox filters
    filterInputs.forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });
    
    // Price range sliders
    priceSliders.forEach(slider => {
        slider.addEventListener('input', handlePriceChange);
    });
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Initialize price display
    updatePriceDisplay();
}

function handleFilterChange(e) {
    const filterType = e.target.name;
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
        if (!currentFilters[filterType].includes(value)) {
            currentFilters[filterType].push(value);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(item => item !== value);
    }
    
    applyFilters();
}

function handlePriceChange(e) {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    
    let minVal = parseInt(minSlider.value);
    let maxVal = parseInt(maxSlider.value);
    
    // Ensure min is always less than max
    if (minVal >= maxVal) {
        if (e.target.id === 'price-min') {
            maxVal = minVal + 1000;
            maxSlider.value = maxVal;
        } else {
            minVal = maxVal - 1000;
            minSlider.value = minVal;
        }
    }
    
    currentFilters.priceMin = minVal;
    currentFilters.priceMax = maxVal;
    
    updatePriceDisplay();
    
    // Debounce filter application
    clearTimeout(window.priceFilterTimeout);
    window.priceFilterTimeout = setTimeout(() => {
        applyFilters();
    }, 300);
}

function updatePriceDisplay() {
    const minValue = document.getElementById('price-min-value');
    const maxValue = document.getElementById('price-max-value');
    
    if (minValue) minValue.textContent = currentFilters.priceMin.toLocaleString();
    if (maxValue) maxValue.textContent = currentFilters.priceMax.toLocaleString();
}

function clearAllFilters() {
    // Reset filter object
    currentFilters = {
        category: [],
        fabric: [],
        color: [],
        priceMin: 1000,
        priceMax: 50000,
        search: ''
    };
    
    // Reset UI elements
    filterInputs.forEach(input => {
        input.checked = false;
    });
    
    document.getElementById('price-min').value = 1000;
    document.getElementById('price-max').value = 50000;
    updatePriceDisplay();
    
    // Reset sorting
    sortSelect.value = 'default';
    currentSort = 'default';
    
    // Apply filters and re-render
    applyFilters();
}

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) {
            return false;
        }
        
        // Fabric filter
        if (currentFilters.fabric.length > 0 && !currentFilters.fabric.includes(product.fabric)) {
            return false;
        }
        
        // Color filter
        if (currentFilters.color.length > 0 && !currentFilters.color.includes(product.color)) {
            return false;
        }
        
        // Price filter
        if (product.price < currentFilters.priceMin || product.price > currentFilters.priceMax) {
            return false;
        }
        
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const productText = `${product.name} ${product.category} ${product.fabric} ${product.description}`.toLowerCase();
            if (!productText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Apply sorting
    applySorting();
    
    // Re-render products
    renderProducts();
    updateResultsCount();
    updatePagination();
}

// ==========================================
// SORTING
// ==========================================
function initializeSorting() {
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

function handleSortChange(e) {
    currentSort = e.target.value;
    applySorting();
    renderProducts();
}

function applySorting() {
    switch (currentSort) {
        case 'popularity':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'date':
            filteredProducts.sort((a, b) => {
                if (a.isNew && !b.isNew) return -1;
                if (!a.isNew && b.isNew) return 1;
                return b.id - a.id;
            });
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Default sorting (by ID)
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
    }
}

// ==========================================
// VIEW TOGGLE
// ==========================================
function initializeViewToggle() {
    viewButtons.forEach(btn => {
        btn.addEventListener('click', handleViewChange);
    });
}

function handleViewChange(e) {
    const view = e.target.closest('.view-btn').dataset.view;
    currentView = view;
    
    // Update button states
    viewButtons.forEach(btn => btn.classList.remove('active'));
    e.target.closest('.view-btn').classList.add('active');
    
    // Update grid class
    productsGrid.className = view === 'list' ? 'products-grid list-view' : 'products-grid';
    
    // Re-render products with new view
    renderProducts();
}

// ==========================================
// PRODUCTS RENDERING
// ==========================================
function renderProducts() {
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    const badgeText = product.badge === 'sale' ? `-${discountPercentage}%` :
                     product.badge === 'new' ? 'NEW' :
                     product.badge === 'limited' ? 'LIMITED' : '';

    return `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<span class="product-badge ${product.badge}">${badgeText}</span>` : ''}
            
            <div class="product-actions">
                <button class="wishlist-btn" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="quick-view-btn" title="Quick View" onclick="openQuickView(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="compare-btn" title="Compare">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
            
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-info">
                <div class="product-category">${capitalizeFirst(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    ৳${product.price.toLocaleString()}
                    ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                
                <button class="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    
    return stars;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// PAGINATION
// ==========================================
function initializePagination() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn') && !e.target.disabled) {
            const page = e.target.dataset.page;
            if (page) {
                currentPage = parseInt(page);
                renderProducts();
                updatePagination();
                
                // Scroll to top of products
                document.querySelector('.products-content').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }
        
        if (e.target.closest('.prev')) {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                updatePagination();
            }
        }
        
        if (e.target.closest('.next')) {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                updatePagination();
            }
        }
    });
}

function updatePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const isActive = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="page-btn ${isActive}" data-page="${i}">${i}</button>`;
    }
    
    // Dots and last page
    if (totalPages > 5) {
        if (currentPage < totalPages - 2) {
            paginationHTML += '<span class="dots">...</span>';
        }
        paginationHTML += `<button class="page-btn ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = paginationHTML;
}

function updateResultsCount() {
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
    
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length === 0 ? '0' : `${startIndex}-${endIndex}`;
    }
    
    if (totalCount) {
        totalCount.textContent = filteredProducts.length;
    }
}

// ==========================================
// VIRTUAL DRAPING TOOL
// ==========================================
function initializeVirtualDraping() {
    if (virtualDrapingBtn) {
        virtualDrapingBtn.addEventListener('click', openVirtualDraping);
    }
    
    // Close modal functionality
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close on backdrop click
    [virtualDrapingModal, quickViewModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModals();
                }
            });
        }
    });
    
    // Initialize draping tool features
    initializeDrapingFeatures();
}

function openVirtualDraping() {
    if (virtualDrapingModal) {
        virtualDrapingModal.classList.add('active');
        document.body.classList.add('no-scroll');
        loadSareeOptions();
    }
}

function initializeDrapingFeatures() {
    // Model selection
    const modelBtns = document.querySelectorAll('.model-btn');
    modelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modelBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const modelId = e.target.dataset.model;
            updateModelImage(modelId);
        });
    });
    
    // Photo upload
    const photoUpload = document.getElementById('photo-upload');
    const uploadArea = document.getElementById('upload-area');
    
    if (uploadArea && photoUpload) {
        uploadArea.addEventListener('click', () => photoUpload.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handlePhotoUpload(files[0]);
            }
        });
        
        photoUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handlePhotoUpload(e.target.files[0]);
            }
        });
    }
    
    // Draping actions
    const saveBtn = document.getElementById('save-look');
    const shareBtn = document.getElementById('share-look');
    const consultationBtn = document.getElementById('book-consultation');
    
    if (saveBtn) saveBtn.addEventListener('click', saveLook);
    if (shareBtn) shareBtn.addEventListener('click', shareLook);
    if (consultationBtn) consultationBtn.addEventListener('click', bookConsultation);
}

function updateModelImage(modelId) {
    const modelImage = document.getElementById('model-image');
    if (modelImage) {
        modelImage.src = `assets/images/model-${modelId}.jpg`;
    }
}

function handlePhotoUpload(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const modelImage = document.getElementById('model-image');
            if (modelImage) {
                modelImage.src = e.target.result;
            }
            
            // Update upload area to show success
            const uploadArea = document.getElementById('upload-area');
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: green; font-size: 2rem;"></i>
                <p style="color: green;">Photo uploaded successfully!</p>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function loadSareeOptions() {
    const sareeOptions = document.getElementById('saree-options');
    if (!sareeOptions) return;
    
    // Load first 12 products as saree options
    const options = allProducts.slice(0, 12);
    
    sareeOptions.innerHTML = options.map(product => `
        <div class="saree-option" data-product-id="${product.id}" onclick="selectSaree(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}">
        </div>
    `).join('');
}

function selectSaree(productId) {
    // Remove previous selection
    document.querySelectorAll('.saree-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`.saree-option[data-product-id="${productId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Here you would implement the actual draping logic
    // For now, we'll just show a success message
    window.SareeElegance.showNotification('Saree selected for virtual draping!', 'success');
}

function saveLook() {
    // Implement save functionality
    window.SareeElegance.showNotification('Look saved to your profile!', 'success');
}

function shareLook() {
    // Implement share functionality
    if (navigator.share) {
        navigator.share({
            title: 'My Virtual Saree Look',
            text: 'Check out my virtual saree draping!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            window.SareeElegance.showNotification('Link copied to clipboard!', 'success');
        });
    }
}

function bookConsultation() {
    window.location.href = 'appointment.html?service=consultation';
}

// ==========================================
// QUICK VIEW
// ==========================================
function initializeQuickView() {
    // Quick view is initialized through global click handler
    // Thumbnail navigation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('thumbnail') && e.target.tagName === 'IMG') {
            const mainImage = document.getElementById('quick-view-main-image');
            if (mainImage) {
                mainImage.src = e.target.src;
                
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        }
    });
}

function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !quickViewModal) return;
    
    // Populate modal content
    document.getElementById('quick-view-title').textContent = product.name;
    document.getElementById('quick-view-rating').innerHTML = generateStars(product.rating) + 
        `<span class="rating-count">(${product.reviews} reviews)</span>`;
    
    const priceHTML = `৳${product.price.toLocaleString()}` +
        (product.originalPrice ? ` <span class="original-price">৳${product.originalPrice.toLocaleString()}</span>` : '');
    document.getElementById('quick-view-price').innerHTML = priceHTML;
    
    document.getElementById('quick-view-description').textContent = product.description;
    
    // Set main image
    const mainImage = document.getElementById('quick-view-main-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Set thumbnails
    const thumbnailsContainer = document.getElementById('quick-view-thumbnails');
    thumbnailsContainer.innerHTML = product.images.map((img, index) => `
        <img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}">;
    `).join('');
    
    // Set product ID for add to cart
    quickViewModal.dataset.productId = productId;
    
    // Show modal
    quickViewModal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeModals() {
    [virtualDrapingModal, quickViewModal].forEach(modal => {
        if (modal) {
            modal.classList.remove('active');
        }
    });
    document.body.classList.remove('no-scroll');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function debounce(func, wait) {
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

// ==========================================
// EXPORT FUNCTIONS
// ==========================================
window.openQuickView = openQuickView;
window.selectSaree = selectSaree;
