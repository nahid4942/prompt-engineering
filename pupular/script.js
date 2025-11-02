/**
 * Discover Bangladesh - Tourism Website JavaScript
 * Interactive functionality for Bangladesh tourism website
 */

// ===== GLOBAL VARIABLES =====
let currentHeroSlide = 0;
let currentTestimonial = 0;
let isLoading = true;

// Mobile menu state
let isMobileMenuOpen = false;

// Hero slides data
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1562907550-096d3bf9b25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        title: 'Discover the Mangrove Magic',
        subtitle: 'Explore the mystical Sundarbans, home to Royal Bengal Tigers and countless wildlife species'
    },
    {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        title: 'World\'s Longest Sea Beach',
        subtitle: 'Experience the golden shores of Cox\'s Bazar stretching endlessly into the horizon'
    },
    {
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        title: 'Tea Gardens of Sylhet',
        subtitle: 'Journey through rolling hills carpeted with emerald tea plantations'
    },
    {
        image: 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        title: 'Ancient Heritage & Culture',
        subtitle: 'Immerse yourself in 4000 years of rich history and vibrant traditions'
    }
];

// Testimonials data
const testimonials = [
    {
        text: "Bangladesh offered us an incredible journey through untouched natural beauty. The Sundarbans boat safari was absolutely magical, and our guide's knowledge made every moment special.",
        author: "Sarah Johnson",
        location: "United Kingdom",
        rating: 5
    },
    {
        text: "The cultural experiences in Bangladesh are unmatched. From the vibrant festivals to the warm hospitality of locals, every day brought new discoveries and lifelong memories.",
        author: "Marco Rodriguez",
        location: "Spain",
        rating: 5
    },
    {
        text: "Cox's Bazar exceeded all expectations! The sunset views, fresh seafood, and pristine beaches made it the perfect romantic getaway. Can't wait to return!",
        author: "Emma Chen",
        location: "Australia",
        rating: 5
    },
    {
        text: "The tea gardens of Sylhet are like stepping into a fairy tale. The misty mornings, rolling hills, and authentic tea tasting experience were absolutely unforgettable.",
        author: "David Thompson",
        location: "Canada",
        rating: 5
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    console.log('🇧🇩 Initializing Discover Bangladesh website...');
    
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize hero slider
    initializeHeroSlider();
    
    // Initialize testimonials
    initializeTestimonials();
    
    // Initialize forms
    initializeForms();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize modals
    initializeModals();
    
    // Initialize destination images
    initializeDestinationImages();
    
    console.log('✅ Website initialization complete!');
}

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            isLoading = false;
            
            // Remove loading screen after transition
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (isMobileMenuOpen) {
                        toggleMobileMenu();
                    }
                }
            }
        });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'var(--bg-primary)';
        navMenu.style.boxShadow = 'var(--shadow-lg)';
        navMenu.style.padding = '20px';
        hamburger.classList.add('active');
    } else {
        navMenu.style.display = '';
        navMenu.style.flexDirection = '';
        navMenu.style.position = '';
        navMenu.style.top = '';
        navMenu.style.left = '';
        navMenu.style.right = '';
        navMenu.style.background = '';
        navMenu.style.boxShadow = '';
        navMenu.style.padding = '';
        hamburger.classList.remove('active');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// ===== HERO SLIDER =====
function initializeHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    const heroNavigation = document.querySelector('.hero-nav');
    
    if (!heroSlider || !heroNavigation) return;
    
    // Create hero slides
    createHeroSlides();
    
    // Create navigation dots
    createHeroNavigation();
    
    // Start auto-rotation
    startHeroRotation();
    
    // Add click handlers for navigation
    heroNavigation.addEventListener('click', (e) => {
        if (e.target.classList.contains('hero-nav-btn')) {
            const slideIndex = parseInt(e.target.dataset.slide);
            goToHeroSlide(slideIndex);
        }
    });
}

function createHeroSlides() {
    const heroSlider = document.querySelector('.hero-slider');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    heroSlides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slideElement.style.backgroundImage = `url(${slide.image})`;
        heroSlider.appendChild(slideElement);
    });
    
    // Set initial content
    updateHeroContent(0);
}

function createHeroNavigation() {
    const heroNavigation = document.querySelector('.hero-nav');
    
    heroSlides.forEach((_, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = `hero-nav-btn ${index === 0 ? 'active' : ''}`;
        navBtn.dataset.slide = index;
        heroNavigation.appendChild(navBtn);
    });
}

function goToHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const navBtns = document.querySelectorAll('.hero-nav-btn');
    
    // Remove active class from current slide
    slides[currentHeroSlide].classList.remove('active');
    navBtns[currentHeroSlide].classList.remove('active');
    
    // Update current slide index
    currentHeroSlide = index;
    
    // Add active class to new slide
    slides[currentHeroSlide].classList.add('active');
    navBtns[currentHeroSlide].classList.add('active');
    
    // Update content
    updateHeroContent(index);
}

function updateHeroContent(index) {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle && heroSubtitle) {
        heroTitle.innerHTML = heroSlides[index].title;
        heroSubtitle.innerHTML = heroSlides[index].subtitle;
    }
}

function startHeroRotation() {
    setInterval(() => {
        if (!isLoading) {
            const nextSlide = (currentHeroSlide + 1) % heroSlides.length;
            goToHeroSlide(nextSlide);
        }
    }, 5000);
}

// ===== TESTIMONIALS =====
function initializeTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonials-slider');
    const testimonialsNav = document.querySelector('.testimonial-nav');
    
    if (!testimonialsContainer || !testimonialsNav) return;
    
    createTestimonials();
    createTestimonialsNavigation();
    startTestimonialsRotation();
    
    testimonialsNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('testimonial-nav-btn')) {
            const testimonialIndex = parseInt(e.target.dataset.testimonial);
            goToTestimonial(testimonialIndex);
        }
    });
}

function createTestimonials() {
    const container = document.querySelector('.testimonials-slider');
    
    testimonials.forEach((testimonial, index) => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
        
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p>"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4>${testimonial.author}</h4>
                        <span>${testimonial.location}</span>
                    </div>
                    <div class="rating">
                        ${'★'.repeat(testimonial.rating)}
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(testimonialCard);
    });
}

function createTestimonialsNavigation() {
    const nav = document.querySelector('.testimonial-nav');
    
    testimonials.forEach((_, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = `testimonial-nav-btn ${index === 0 ? 'active' : ''}`;
        navBtn.dataset.testimonial = index;
        nav.appendChild(navBtn);
    });
}

function goToTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const navBtns = document.querySelectorAll('.testimonial-nav-btn');
    
    // Remove active class
    testimonialCards[currentTestimonial].classList.remove('active');
    navBtns[currentTestimonial].classList.remove('active');
    
    // Update current testimonial
    currentTestimonial = index;
    
    // Add active class
    testimonialCards[currentTestimonial].classList.add('active');
    navBtns[currentTestimonial].classList.add('active');
}

function startTestimonialsRotation() {
    setInterval(() => {
        if (!isLoading) {
            const nextTestimonial = (currentTestimonial + 1) % testimonials.length;
            goToTestimonial(nextTestimonial);
        }
    }, 6000);
}

// ===== FORMS =====
function initializeForms() {
    const quickSearchForm = document.querySelector('.search-form');
    const contactForm = document.querySelector('.contact-form');
    
    // Quick search form
    if (quickSearchForm) {
        quickSearchForm.addEventListener('submit', handleQuickSearch);
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function handleQuickSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchData = {
        destination: formData.get('destination'),
        tourType: formData.get('tour-type'),
        duration: formData.get('duration'),
        budget: formData.get('budget')
    };
    
    console.log('Quick search data:', searchData);
    
    // Show notification
    showNotification('Searching for perfect packages...', 'info');
    
    // Simulate search
    setTimeout(() => {
        showNotification('Found 12 amazing packages for you!', 'success');
        // In a real application, this would redirect to search results
        document.querySelector('#packages').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateContactForm(contactData)) {
        return;
    }
    
    console.log('Contact form data:', contactData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a detailed message');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    initializeDestinationCards();
    initializePackageCards();
    initializeExperienceCards();
    initializeScrollEffects();
    initializeLanguageToggle();
}

function initializeDestinationCards() {
    const destinationCards = document.querySelectorAll('.destination-card');
    
    destinationCards.forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.querySelector('h3').textContent;
            showDestinationModal(destination);
        });
        
        // Add hover effect for mobile
        card.addEventListener('touchstart', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => card.classList.remove('hover'), 300);
        });
    });
}

function initializePackageCards() {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        const bookBtn = card.querySelector('.btn-primary');
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const packageName = card.querySelector('h3').textContent;
                showBookingModal(packageName);
            });
        }
        
        // Quick view on card click
        card.addEventListener('click', () => {
            const packageName = card.querySelector('h3').textContent;
            showPackageDetails(packageName);
        });
    });
}

function initializeExperienceCards() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        card.addEventListener('click', () => {
            const experience = card.querySelector('h3').textContent;
            showExperienceModal(experience);
        });
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSlides = document.querySelectorAll('.hero-slide');
        
        heroSlides.forEach(slide => {
            const speed = 0.5;
            slide.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.destination-card, .experience-card, .package-card, .feature-item');
    animateElements.forEach(el => observer.observe(el));
}

function initializeLanguageToggle() {
    const languageToggle = document.querySelector('.language-toggle');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const currentLang = languageToggle.textContent.includes('EN') ? 'EN' : 'বাং';
            const newLang = currentLang === 'EN' ? 'বাং' : 'EN';
            
            languageToggle.innerHTML = `<i class="fas fa-globe"></i> ${newLang}`;
            showNotification(`Language switched to ${newLang === 'EN' ? 'English' : 'Bangla'}`, 'info');
        });
    }
}

// ===== MODALS =====
function initializeModals() {
    // Modal close functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function showDestinationModal(destination) {
    const content = getDestinationContent(destination);
    showModal(`Explore ${destination}`, content);
}

function showBookingModal(packageName) {
    const content = getBookingFormContent(packageName);
    showModal(`Book ${packageName}`, content);
}

function showPackageDetails(packageName) {
    const content = getPackageDetailsContent(packageName);
    showModal(`${packageName} - Details`, content);
}

function showExperienceModal(experience) {
    const content = getExperienceContent(experience);
    showModal(`${experience} Experience`, content);
}

// ===== MODAL CONTENT GENERATORS =====
function getDestinationContent(destination) {
    const destinationInfo = {
        'Sundarbans': {
            description: 'The world\'s largest mangrove forest and UNESCO World Heritage Site, home to the majestic Royal Bengal Tiger.',
            highlights: ['Royal Bengal Tiger spotting', 'Boat safaris through mangrove channels', 'Bird watching (over 300 species)', 'Fishing village visits', 'Sunset from the river'],
            bestTime: 'November to March',
            duration: '2-4 days'
        },
        'Cox\'s Bazar': {
            description: 'The world\'s longest natural sandy sea beach stretching 120 kilometers along the Bay of Bengal.',
            highlights: ['Longest natural sea beach', 'Fresh seafood delicacies', 'Beach horseback riding', 'Himchari waterfalls', 'Inani Beach coral stones'],
            bestTime: 'October to March',
            duration: '2-5 days'
        },
        'Sylhet': {
            description: 'The land of tea gardens, rolling hills, and spiritual heritage in northeastern Bangladesh.',
            highlights: ['Tea garden tours', 'Ratargul swamp forest', 'Jaflong stone collection', 'Lalakhal blue river', 'Shah Jalal shrine'],
            bestTime: 'October to April',
            duration: '3-5 days'
        },
        'Chittagong Hill Tracts': {
            description: 'A mountainous region with indigenous cultures, pristine lakes, and lush green landscapes.',
            highlights: ['Kaptai Lake boat rides', 'Indigenous cultural experiences', 'Hanging bridge at Rangamati', 'Buddhist temples', 'Hill trekking'],
            bestTime: 'November to February',
            duration: '3-6 days'
        }
    };
    
    const info = destinationInfo[destination] || destinationInfo['Sundarbans'];
    
    return `
        <div class="destination-modal-content">
            <p>${info.description}</p>
            
            <h4>Key Highlights</h4>
            <ul>
                ${info.highlights.map(highlight => `<li><i class="fas fa-check-circle"></i> ${highlight}</li>`).join('')}
            </ul>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0;">
                <div>
                    <h5><i class="fas fa-calendar"></i> Best Time to Visit</h5>
                    <p>${info.bestTime}</p>
                </div>
                <div>
                    <h5><i class="fas fa-clock"></i> Recommended Duration</h5>
                    <p>${info.duration}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
                <button class="btn btn-primary btn-large" onclick="showBookingModal('${destination} Tour')">
                    <i class="fas fa-paper-plane"></i>
                    Plan Your Trip
                </button>
            </div>
        </div>
    `;
}

function getBookingFormContent(packageName) {
    return `
        <form class="booking-form" onsubmit="handleBookingForm(event, '${packageName}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label for="booking-name">Full Name *</label>
                    <input type="text" id="booking-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="booking-email">Email Address *</label>
                    <input type="email" id="booking-email" name="email" required>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label for="booking-phone">Phone Number *</label>
                    <input type="tel" id="booking-phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="booking-travelers">Number of Travelers *</label>
                    <select id="booking-travelers" name="travelers" required>
                        <option value="">Select travelers</option>
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3-5">3-5 People</option>
                        <option value="6-10">6-10 People</option>
                        <option value="10+">10+ People</option>
                    </select>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label for="booking-date">Preferred Travel Date</label>
                    <input type="date" id="booking-date" name="date">
                </div>
                <div class="form-group">
                    <label for="booking-budget">Budget Range</label>
                    <select id="booking-budget" name="budget">
                        <option value="">Select budget</option>
                        <option value="budget">Budget Friendly (৳5,000-15,000)</option>
                        <option value="standard">Standard (৳15,000-30,000)</option>
                        <option value="premium">Premium (৳30,000-50,000)</option>
                        <option value="luxury">Luxury (৳50,000+)</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="booking-requirements">Special Requirements</label>
                <textarea id="booking-requirements" name="requirements" rows="4" placeholder="Any special dietary needs, accessibility requirements, or preferences..."></textarea>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
                <button type="submit" class="btn btn-primary btn-large">
                    <i class="fas fa-calendar-check"></i>
                    Request Booking
                </button>
            </div>
        </form>
    `;
}

function getPackageDetailsContent(packageName) {
    const packageDetails = {
        'Sundarbans Wildlife Safari': {
            price: '৳12,000',
            duration: '3 Days / 2 Nights',
            includes: ['Comfortable boat accommodation', 'All meals during the trip', 'Professional wildlife guide', 'Tiger spotting safari', 'Bird watching tours', 'Fishing village visits'],
            itinerary: [
                'Day 1: Dhaka to Sundarbans, Evening boat safari',
                'Day 2: Full day wildlife exploration, Tiger spotting',
                'Day 3: Bird watching, Return to Dhaka'
            ]
        },
        'Cox\'s Bazar Beach Holiday': {
            price: '৳8,000',
            duration: '4 Days / 3 Nights',
            includes: ['Sea-view hotel accommodation', 'Daily breakfast', 'Beach activities', 'Himchari waterfall visit', 'Fresh seafood dinner', 'Airport transfers'],
            itinerary: [
                'Day 1: Arrival, Beach exploration',
                'Day 2: Himchari & Inani Beach tour',
                'Day 3: Water sports and relaxation',
                'Day 4: Shopping and departure'
            ]
        }
    };
    
    const details = packageDetails[packageName] || packageDetails['Sundarbans Wildlife Safari'];
    
    return `
        <div class="package-details-content">
            <div class="package-overview">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 32px;">
                    <div class="detail-item">
                        <h5><i class="fas fa-money-bill-wave"></i> Price</h5>
                        <p>${details.price} per person</p>
                    </div>
                    <div class="detail-item">
                        <h5><i class="fas fa-clock"></i> Duration</h5>
                        <p>${details.duration}</p>
                    </div>
                    <div class="detail-item">
                        <h5><i class="fas fa-users"></i> Group Size</h5>
                        <p>2-15 people</p>
                    </div>
                </div>
            </div>
            
            <h4><i class="fas fa-check-circle"></i> What's Included</h4>
            <ul style="margin-bottom: 32px;">
                ${details.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
            </ul>
            
            <h4><i class="fas fa-route"></i> Itinerary</h4>
            <ul style="margin-bottom: 32px;">
                ${details.itinerary.map(item => `<li><i class="fas fa-calendar-day"></i> ${item}</li>`).join('')}
            </ul>
            
            <div style="text-align: center;">
                <button class="btn btn-primary btn-large" onclick="showBookingModal('${packageName}')">
                    <i class="fas fa-paper-plane"></i>
                    Book This Package
                </button>
            </div>
        </div>
    `;
}

function getExperienceContent(experience) {
    const experienceInfo = {
        'River Cruise on Paddle Steamer': {
            description: 'Experience the nostalgia of river travel on a traditional paddle steamer through Bangladesh\'s river networks.',
            duration: 'Half day to 3 days',
            price: 'From ৳2,500',
            highlights: ['Historic paddle steamer journey', 'River life observation', 'Traditional meals onboard', 'Sunset photography', 'Local village visits']
        },
        'Traditional Otter Fishing': {
            description: 'Witness the unique tradition of fishing with trained otters, practiced by local fishermen for generations.',
            duration: '2-3 hours',
            price: 'From ৳1,500',
            highlights: ['Otter fishing demonstration', 'Interaction with fishermen', 'Learn traditional techniques', 'Photography opportunities', 'Cultural storytelling']
        },
        'Countryside Cycling Adventure': {
            description: 'Explore rural Bangladesh on bicycle, cycling through villages, rice fields, and connecting with local communities.',
            duration: 'Full day',
            price: 'From ৳3,000',
            highlights: ['Guided cycling tours', 'Village homestay option', 'Rice field exploration', 'Local food tasting', 'Cultural immersion']
        },
        'Floating Market Experience': {
            description: 'Visit traditional floating markets where vendors sell fresh produce and goods directly from their boats.',
            duration: '3-4 hours',
            price: 'From ৳2,000',
            highlights: ['Early morning market visit', 'Boat ride experience', 'Fresh produce shopping', 'Local breakfast', 'Photography session']
        }
    };
    
    const info = experienceInfo[experience] || experienceInfo['River Cruise on Paddle Steamer'];
    
    return `
        <div class="experience-details">
            <p style="font-size: 1.1em; margin-bottom: 24px;">${info.description}</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
                <div class="info-card">
                    <h5><i class="fas fa-clock"></i> Duration</h5>
                    <p>${info.duration}</p>
                </div>
                <div class="info-card">
                    <h5><i class="fas fa-tag"></i> Starting Price</h5>
                    <p>${info.price}</p>
                </div>
            </div>
            
            <h4>Experience Highlights</h4>
            <ul style="margin-bottom: 32px;">
                ${info.highlights.map(highlight => `<li><i class="fas fa-star"></i> ${highlight}</li>`).join('')}
            </ul>
            
            <div style="text-align: center;">
                <button class="btn btn-primary btn-large" onclick="showBookingModal('${experience}')">
                    <i class="fas fa-calendar-plus"></i>
                    Book This Experience
                </button>
            </div>
        </div>
    `;
}

// ===== FORM HANDLERS =====
function handleBookingForm(e, packageName) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        package: packageName,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        travelers: formData.get('travelers'),
        date: formData.get('date'),
        budget: formData.get('budget'),
        requirements: formData.get('requirements')
    };
    
    console.log('Booking request:', bookingData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
        showNotification('Booking request submitted successfully! We\'ll contact you within 2 hours.', 'success');
        closeModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ===== DESTINATION IMAGES =====
function initializeDestinationImages() {
    const destinationImages = {
        'Sundarbans': 'https://images.unsplash.com/photo-1562907550-096d3bf9b25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Cox\'s Bazar': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Sylhet': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Chittagong Hill Tracts': 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    const packageImages = {
        'Sundarbans Wildlife Safari': 'https://images.unsplash.com/photo-1562907550-096d3bf9b25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'Cox\'s Bazar Beach Holiday': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'Sylhet Tea Garden Tour': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'Chittagong Hills Explorer': 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };
    
    // Set destination images
    document.querySelectorAll('.destination-card').forEach(card => {
        const title = card.querySelector('h3').textContent;
        const img = card.querySelector('img');
        if (img && destinationImages[title]) {
            img.src = destinationImages[title];
            img.alt = `${title} - Beautiful destination in Bangladesh`;
        }
    });
    
    // Set package images
    document.querySelectorAll('.package-card').forEach(card => {
        const title = card.querySelector('h3').textContent;
        const img = card.querySelector('img');
        if (img && packageImages[title]) {
            img.src = packageImages[title];
            img.alt = `${title} - Travel package in Bangladesh`;
        }
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .destination-card,
        .experience-card,
        .package-card,
        .feature-item {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
        
        .destination-card.animate-in,
        .experience-card.animate-in,
        .package-card.animate-in,
        .feature-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .destination-card.hover {
            transform: translateY(-8px);
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.loading = 'lazy';
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics here
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🇧🇩 Welcome to Popular Tourism & Trade!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Discover Bangladesh with Popular Tourism and Trade - from the mystical Sundarbans to Cox's Bazar
🐅 Witness Royal Bengal Tigers in their natural habitat
🏖️ Relax on the world's longest natural sea beach
🍃 Journey through emerald tea gardens of Sylhet
🛶 Experience traditional river life and culture

Website features:
📱 Fully responsive design
🎨 Bangladesh-inspired color palette
⚡ Smooth animations and interactions
🔍 Smart search functionality
📞 Easy booking and contact system

Ready to explore Bangladesh? Let's begin your journey!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Initialize image optimization
document.addEventListener('DOMContentLoaded', optimizeImages);