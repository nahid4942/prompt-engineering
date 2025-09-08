// EggPotato Cloud Kitchen JavaScript

// Global Variables
let cart = [];
let isMenuOpen = false;

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupSmoothScrolling();
    setupFormHandling();
    animateOnScroll();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (isMenuOpen) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink() {
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

// Menu Category Functions
function showCategory(categoryId) {
    // Hide all categories
    const categories = document.querySelectorAll('.menu-category');
    categories.forEach(category => {
        category.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected category
    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory) {
        selectedCategory.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Animate category change
    const menuGrid = selectedCategory.querySelector('.menu-grid');
    if (menuGrid) {
        menuGrid.style.opacity = '0';
        menuGrid.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            menuGrid.style.opacity = '1';
            menuGrid.style.transform = 'translateY(0)';
            menuGrid.style.transition = 'all 0.3s ease';
        }, 100);
    }
}

// Order Functions
function orderDish(dishName, price) {
    // Create WhatsApp message
    const message = `Hi EggPotato! I'd like to order:\n\n${dishName} - ৳${price}\n\nPlease confirm my order and let me know the delivery time. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+8801XXXXXXXXX?text=${encodedMessage}`;
    
    // Show order confirmation
    showNotification(`${dishName} added to your order! Redirecting to WhatsApp...`);
    
    // Add to cart (for tracking)
    addToCart(dishName, price);
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

function addToCart(dishName, price) {
    const existingItem = cart.find(item => item.name === dishName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: dishName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToLocalStorage();
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounter = document.querySelector('.cart-counter');
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('eggpotatoCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('eggpotatoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Form Handling
function setupFormHandling() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
    const phone = formData.get('phone') || contactForm.querySelector('input[type="tel"]').value;
    const message = formData.get('message') || contactForm.querySelector('textarea').value;
    
    // Create WhatsApp message
    const whatsappMessage = `Hi EggPotato!\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}\n\nThank you!`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/+8801XXXXXXXXX?text=${encodedMessage}`;
    
    // Show success message
    showNotification('Message sent! Redirecting to WhatsApp...');
    
    // Clear form
    contactForm.reset();
    
    // Redirect to WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(300px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Animation on Scroll
function animateOnScroll() {
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
        '.dish-card, .menu-item, .feature, .contact-item, .order-platform'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function formatPrice(price) {
    return `৳${price}`;
}

function generateOrderId() {
    return 'EP' + Date.now().toString().slice(-6);
}

// Initialize cart from localStorage on page load
loadCartFromLocalStorage();

// Google Analytics Event Tracking
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track menu interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-order')) {
        const dishName = e.target.closest('.dish-card, .menu-item').querySelector('h3').textContent;
        trackEvent('order_click', 'menu', dishName);
    }
    
    if (e.target.classList.contains('tab-btn')) {
        const category = e.target.textContent.trim();
        trackEvent('category_view', 'menu', category);
    }
});

// Performance optimization
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

// Debounce scroll events
window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Lazy loading for images
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
