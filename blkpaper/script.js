// BlkPaper - Black & White Fashion Store JavaScript

// ===== GLOBAL VARIABLES =====
let cart = [];
let wishlist = [];
let currentSlide = 0;
const products = [
    {
        id: 1,
        name: 'Premium Black T-Shirt',
        category: 't-shirts',
        price: 1500,
        originalPrice: 2000,
        rating: 4.8,
        reviews: 124,
        colors: ['black', 'white'],
        sizes: ['S', 'M', 'L', 'XL'],
        badge: 'new',
        image: 'placeholder-tshirt.jpg',
        description: 'Premium quality cotton t-shirt with comfortable fit and elegant design.'
    },
    {
        id: 2,
        name: 'Elegant Black Saree',
        category: 'sarees',
        price: 8500,
        originalPrice: 12000,
        rating: 4.9,
        reviews: 89,
        colors: ['black', 'white'],
        badge: 'bestseller',
        image: 'placeholder-saree.jpg',
        description: 'Traditional elegant saree crafted with finest materials and intricate designs.'
    },
    {
        id: 3,
        name: 'Classic Black Watch',
        category: 'watches',
        price: 5500,
        originalPrice: 8000,
        rating: 4.7,
        reviews: 256,
        colors: ['black', 'white'],
        badge: 'sale',
        image: 'placeholder-watch.jpg',
        description: 'Sophisticated timepiece with premium craftsmanship and timeless design.'
    },
    {
        id: 4,
        name: 'Black Leather Belt',
        category: 'accessories',
        price: 850,
        rating: 4.6,
        reviews: 67,
        colors: ['black', 'white'],
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'placeholder-belt.jpg',
        description: 'Genuine leather belt with classic buckle design for everyday elegance.'
    },
    {
        id: 5,
        name: 'Classic White T-Shirt',
        category: 't-shirts',
        price: 1800,
        rating: 4.5,
        reviews: 98,
        colors: ['white', 'black'],
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'placeholder-white-tshirt.jpg',
        description: 'Crisp white t-shirt made from premium cotton for ultimate comfort.'
    },
    {
        id: 6,
        name: 'Black Sunglasses',
        category: 'accessories',
        price: 1200,
        originalPrice: 1800,
        rating: 4.8,
        reviews: 45,
        colors: ['black', 'white'],
        badge: 'limited',
        image: 'placeholder-sunglasses.jpg',
        description: 'Stylish sunglasses with UV protection and premium frame quality.'
    }
];

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.getElementById('navMenu');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const cartSidebar = document.getElementById('cartSidebar');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const productsGrid = document.getElementById('productsGrid');
const quickViewModal = document.getElementById('quickViewModal');
const toast = document.getElementById('toast');
const overlay = document.getElementById('overlay');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    hideLoadingScreen();
    setupEventListeners();
    loadCartFromStorage();
    loadWishlistFromStorage();
    updateCounters();
    startHeroSlider();
    setupScrollAnimations();
    setupSearchFunctionality();
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', handleScroll);

    // Close dropdowns when clicking outside
    document.addEventListener('click', closeDropdowns);

    // Form submissions
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', subscribeNewsletter);
    }

    // Escape key handlers
    document.addEventListener('keydown', handleEscapeKey);

    // Color option clicks
    document.addEventListener('click', handleColorOptionClick);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// ===== SCROLL HANDLERS =====
function handleScroll() {
    const scrolled = window.pageYOffset > 50;
    header.classList.toggle('scrolled', scrolled);
    
    // Update active nav links
    updateActiveNavLinks();
}

function updateActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function toggleSearch() {
    searchOverlay.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (searchOverlay.classList.contains('active')) {
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        searchInput.value = '';
        clearSearchSuggestions();
    }
}

function setupSearchFunctionality() {
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
}

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        clearSearchSuggestions();
        return;
    }
    
    const suggestions = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 5);
    
    displaySearchSuggestions(suggestions);
}

function displaySearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No products found</div>';
        return;
    }
    
    const suggestionsHTML = suggestions.map(product => `
        <div class="search-suggestion" onclick="selectProduct(${product.id})">
            <div class="suggestion-image"></div>
            <div class="suggestion-info">
                <h4>${product.name}</h4>
                <p>৳${product.price}</p>
            </div>
        </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
}

function clearSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
    }
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filterProducts('all');
        highlightSearchResults(query);
        toggleSearch();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
}

function selectProduct(productId) {
    quickView(productId);
    toggleSearch();
}

// ===== HERO SLIDER =====
function startHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const navBtns = document.querySelectorAll('.hero-nav-btn');
    
    if (slides.length > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            changeSlide(currentSlide);
        }, 5000);
    }
}

function changeSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const navBtns = document.querySelectorAll('.hero-nav-btn');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
    
    navBtns.forEach((btn, index) => {
        btn.classList.toggle('active', index === slideIndex);
    });
    
    currentSlide = slideIndex;
}

// ===== PRODUCT FILTERING =====
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(category) || 
            (category === 'all' && tab.textContent.toLowerCase().includes('all'))) {
            tab.classList.add('active');
        }
    });
    
    // Filter products
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        const shouldShow = category === 'all' || productCategory === category;
        
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Animate filtered products
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.product-card[style="display: block"]');
        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// ===== PRODUCT SORTING =====
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'rating':
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            case 'newest':
                return b.id - a.id;
            default:
                return 0;
        }
    });
    
    const grid = document.getElementById('productsGrid');
    productCards.forEach(card => grid.appendChild(card));
}

// ===== VIEW CHANGE =====
function changeView(viewType) {
    const grid = document.getElementById('productsGrid');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewType) {
            btn.classList.add('active');
        }
    });
    
    if (viewType === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// ===== CART FUNCTIONALITY =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            selectedColor: 'black',
            selectedSize: product.sizes ? product.sizes[0] : null
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`, 'success');
    updateCounters();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
    updateCounters();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartDisplay();
            saveCartToStorage();
            updateCounters();
        }
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="toggleCart()">Continue Shopping</button>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image"></div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">৳${item.price}</p>
                <div class="cart-item-controls">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    cartItems.innerHTML = cartHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function viewCart() {
    // Redirect to cart page or show cart modal
    showToast('Redirecting to cart page...', 'info');
    toggleCart();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Save cart to localStorage for checkout page
    saveCartToStorage();
    
    // Redirect to checkout page
    showToast('Redirecting to checkout...', 'info');
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

// ===== WISHLIST FUNCTIONALITY =====
function toggleWishlistItem(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    const wishlistBtn = document.querySelector(`[onclick="toggleWishlistItem(${productId})"] i`);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        wishlistBtn.className = 'far fa-heart';
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        wishlist.push(product);
        wishlistBtn.className = 'fas fa-heart';
        showToast(`${product.name} added to wishlist!`, 'success');
    }
    
    updateWishlistDisplay();
    saveWishlistToStorage();
    updateCounters();
}

function updateWishlistDisplay() {
    const wishlistItems = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <p>Your wishlist is empty</p>
                <button class="btn btn-primary" onclick="toggleWishlist()">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    const wishlistHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <div class="wishlist-item-image"></div>
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <p class="wishlist-item-price">৳${item.price}</p>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary" onclick="addToCart(${item.id}); toggleWishlistItem(${item.id})">Add to Cart</button>
                    <button class="btn btn-outline" onclick="toggleWishlistItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    wishlistItems.innerHTML = wishlistHTML;
}

function toggleWishlist() {
    wishlistSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = wishlistSidebar.classList.contains('active') ? 'hidden' : '';
}

// ===== QUICK VIEW =====
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quickViewContent = document.getElementById('quickViewContent');
    
    const colorsHTML = product.colors.map(color => 
        `<span class="color-option ${color === 'black' ? 'active' : ''}" 
         data-color="${color}" 
         style="background: ${color === 'black' ? '#000' : '#fff'}; ${color === 'white' ? 'border: 1px solid #ddd;' : ''}"
         onclick="selectColor('${color}')"></span>`
    ).join('');
    
    const sizesHTML = product.sizes ? product.sizes.map(size => 
        `<span class="size-option ${size === product.sizes[0] ? 'active' : ''}" 
         onclick="selectSize('${size}')">${size}</span>`
    ).join('') : '';
    
    quickViewContent.innerHTML = `
        <div class="quick-view-product">
            <div class="quick-view-image">
                <div class="product-image-placeholder"></div>
            </div>
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">৳${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice}</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-options">
                    <div class="color-selection">
                        <h4>Colors:</h4>
                        <div class="color-options">${colorsHTML}</div>
                    </div>
                    ${sizesHTML ? `
                        <div class="size-selection">
                            <h4>Sizes:</h4>
                            <div class="size-options">${sizesHTML}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="quick-view-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView()">Add to Cart</button>
                    <button class="btn btn-outline" onclick="buyNow(${product.id})">Buy Now</button>
                    <button class="wishlist-btn" onclick="toggleWishlistItem(${product.id})">
                        <i class="${wishlist.find(item => item.id === productId) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    quickViewModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    quickViewModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// ===== BUY NOW =====
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const message = `Hi BlkPaper! I'd like to buy:\n\n${product.name} - ৳${product.price}\n\nPlease confirm availability and payment details. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+8801XXXXXXXXX?text=${encodedMessage}`;
    
    showToast('Redirecting to WhatsApp...', 'success');
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

// ===== FORM HANDLERS =====
function submitContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const subject = formData.get('subject') || e.target.querySelector('input[placeholder="Subject"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    const whatsappMessage = `Hi BlkPaper!\n\nContact Form Submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\nThank you!`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/+8801XXXXXXXXX?text=${encodedMessage}`;
    
    showToast('Message sent! Redirecting to WhatsApp...', 'success');
    e.target.reset();
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

function subscribeNewsletter(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate newsletter subscription
    showToast('Thank you for subscribing to our newsletter!', 'success');
    e.target.reset();
    
    // Store subscription locally
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
}

// ===== UTILITY FUNCTIONS =====
function updateCounters() {
    const cartCountElement = document.getElementById('cartCount');
    const wishlistCountElement = document.getElementById('wishlistCount');
    
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistItemCount = wishlist.length;
    
    cartCountElement.textContent = cartItemCount;
    wishlistCountElement.textContent = wishlistItemCount;
    
    cartCountElement.classList.toggle('show', cartItemCount > 0);
    wishlistCountElement.classList.toggle('show', wishlistItemCount > 0);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    let iconClass = 'fas fa-info-circle';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'info':
            iconClass = 'fas fa-info-circle';
            break;
    }
    
    toastIcon.className = iconClass;
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadMoreProducts() {
    // Simulate loading more products
    showToast('Loading more products...', 'info');
    
    setTimeout(() => {
        showToast('All products loaded!', 'success');
    }, 2000);
}

// ===== STORAGE FUNCTIONS =====
function saveCartToStorage() {
    localStorage.setItem('blkpaper-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('blkpaper-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function saveWishlistToStorage() {
    localStorage.setItem('blkpaper-wishlist', JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('blkpaper-wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistDisplay();
        
        // Update wishlist button states
        wishlist.forEach(item => {
            const wishlistBtn = document.querySelector(`[onclick="toggleWishlistItem(${item.id})"] i`);
            if (wishlistBtn) {
                wishlistBtn.className = 'fas fa-heart';
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.product-card, .category-card, .feature, .contact-item'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ===== EVENT HANDLERS =====
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        if (searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        if (wishlistSidebar.classList.contains('active')) {
            toggleWishlist();
        }
        if (quickViewModal.classList.contains('active')) {
            closeQuickView();
        }
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

function handleColorOptionClick(e) {
    if (e.target.classList.contains('color-option')) {
        const colorOptions = e.target.parentNode.querySelectorAll('.color-option');
        colorOptions.forEach(option => option.classList.remove('active'));
        e.target.classList.add('active');
    }
}

function closeDropdowns(e) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

function selectColor(color) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });
}

function selectSize(size) {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.textContent.trim() === size) {
            option.classList.add('active');
        }
    });
}

function highlightSearchResults(query) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const title = card.querySelector('.product-title');
        if (title && title.textContent.toLowerCase().includes(query)) {
            card.style.border = '2px solid #000';
            setTimeout(() => {
                card.style.border = '';
            }, 3000);
        }
    });
}

// ===== ANALYTICS & TRACKING =====
function trackEvent(action, category, label) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: 1
        });
    }
    
    // Console log for development
    console.log(`Event tracked: ${action} - ${category} - ${label}`);
}

// Track product interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-primary')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('.product-title').textContent;
            trackEvent('add_to_cart', 'product', productName);
        }
    }
    
    if (e.target.closest('.wishlist-btn')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('.product-title').textContent;
            trackEvent('add_to_wishlist', 'product', productName);
        }
    }
    
    if (e.target.closest('.filter-tab')) {
        const category = e.target.textContent.trim();
        trackEvent('filter_products', 'navigation', category);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
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

// Debounced search
const debouncedSearch = debounce(handleSearch, 300);
if (searchInput) {
    searchInput.removeEventListener('input', handleSearch);
    searchInput.addEventListener('input', debouncedSearch);
}

// Debounced scroll
const debouncedScroll = debounce(handleScroll, 100);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', debouncedScroll);

// ===== LAZY LOADING =====
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
setupLazyLoading();

// ===== OFFLINE SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Handle offline/online status
window.addEventListener('online', function() {
    showToast('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showToast('You are offline. Some features may not work.', 'info');
});

// ===== ACCESSIBILITY =====
function setupAccessibility() {
    // Add keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add ARIA labels dynamically
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.querySelector('i')) {
            const icon = button.querySelector('i');
            if (icon.classList.contains('fa-search')) {
                button.setAttribute('aria-label', 'Search');
            } else if (icon.classList.contains('fa-shopping-bag')) {
                button.setAttribute('aria-label', 'Shopping Cart');
            } else if (icon.classList.contains('fa-heart')) {
                button.setAttribute('aria-label', 'Wishlist');
            }
        }
    });
}

// Initialize accessibility features
setupAccessibility();

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        toggleWishlistItem,
        filterProducts,
        sortProducts
    };
}