// Checkout Page JavaScript

// ===== GLOBAL VARIABLES =====
let deliveryFees = {
    dhaka: { standard: 60, express: 120, overnight: 200 },
    chittagong: { standard: 80, express: 150, overnight: 0 },
    sylhet: { standard: 100, express: 180, overnight: 0 },
    rajshahi: { standard: 100, express: 180, overnight: 0 },
    khulna: { standard: 100, express: 180, overnight: 0 },
    barisal: { standard: 120, express: 200, overnight: 0 },
    rangpur: { standard: 120, express: 200, overnight: 0 },
    mymensingh: { standard: 100, express: 180, overnight: 0 },
    other: { standard: 150, express: 250, overnight: 0 }
};

let promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', minOrder: 1000 },
    'SAVE100': { discount: 100, type: 'fixed', minOrder: 500 },
    'BLACKFRIDAY': { discount: 20, type: 'percentage', minOrder: 2000 },
    'NEWUSER': { discount: 15, type: 'percentage', minOrder: 800 }
};

let appliedPromo = null;
let orderData = {
    items: [],
    subtotal: 0,
    deliveryFee: 60,
    discount: 0,
    total: 0
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    loadOrderItems();
    setupEventListeners();
    setupFormValidation();
    updateDeliveryFee();
    calculateTotal();
    setupCardFormatting();
}

// ===== LOAD ORDER ITEMS =====
function loadOrderItems() {
    // Get cart from localStorage or use sample data
    const cart = JSON.parse(localStorage.getItem('blkpaper-cart') || '[]');
    
    if (cart.length === 0) {
        // Sample data for demonstration
        orderData.items = [
            {
                id: 1,
                name: 'Premium Black T-Shirt',
                price: 1500,
                quantity: 2,
                color: 'Black',
                size: 'L'
            },
            {
                id: 2,
                name: 'Classic Black Watch',
                price: 5500,
                quantity: 1,
                color: 'Black'
            }
        ];
    } else {
        orderData.items = cart;
    }
    
    displayOrderItems();
    calculateSubtotal();
}

function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (orderData.items.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-order">
                <p>No items in your order. <a href="index.html">Continue Shopping</a></p>
            </div>
        `;
        return;
    }
    
    const itemsHTML = orderData.items.map(item => `
        <div class="order-item" data-id="${item.id}">
            <div class="item-image">
                <i class="fas fa-image"></i>
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-options">
                    ${item.color ? `Color: ${item.color}` : ''}
                    ${item.size ? ` • Size: ${item.size}` : ''}
                </div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">৳${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    orderItemsContainer.innerHTML = itemsHTML;
}

function calculateSubtotal() {
    orderData.subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `৳${orderData.subtotal.toLocaleString()}`;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleFormSubmission);
    }
    
    // City change for delivery fee calculation
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.addEventListener('change', updateDeliveryFee);
    }
    
    // Payment method change
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', togglePaymentDetails);
    });
    
    // Mobile provider selection
    const mobileProviders = document.querySelectorAll('input[name="mobileProvider"]');
    mobileProviders.forEach(provider => {
        provider.addEventListener('change', updateMobilePaymentInfo);
    });
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Modal close events
    document.addEventListener('click', handleModalClicks);
    document.addEventListener('keydown', handleEscapeKey);
}

// ===== DELIVERY FEE CALCULATION =====
function updateDeliveryFee() {
    const city = document.getElementById('city').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    
    if (!city) {
        orderData.deliveryFee = 60;
        document.getElementById('deliveryFee').textContent = '৳60';
        calculateTotal();
        return;
    }
    
    const cityFees = deliveryFees[city] || deliveryFees.other;
    orderData.deliveryFee = cityFees[deliveryMethod];
    
    // Update delivery prices in UI
    document.getElementById('standardPrice').textContent = `৳${cityFees.standard}`;
    document.getElementById('expressPrice').textContent = `৳${cityFees.express}`;
    document.getElementById('overnightPrice').textContent = cityFees.overnight > 0 ? `৳${cityFees.overnight}` : 'N/A';
    
    // Disable overnight delivery for non-Dhaka cities
    const overnightOption = document.querySelector('input[value="overnight"]');
    const overnightLabel = overnightOption.closest('.delivery-option');
    
    if (cityFees.overnight === 0) {
        overnightOption.disabled = true;
        overnightLabel.style.opacity = '0.5';
        overnightLabel.style.pointerEvents = 'none';
        
        // Switch to standard if overnight was selected
        if (overnightOption.checked) {
            document.querySelector('input[value="standard"]').checked = true;
            orderData.deliveryFee = cityFees.standard;
        }
    } else {
        overnightOption.disabled = false;
        overnightLabel.style.opacity = '1';
        overnightLabel.style.pointerEvents = 'auto';
    }
    
    document.getElementById('deliveryFee').textContent = `৳${orderData.deliveryFee}`;
    calculateTotal();
}

// ===== PAYMENT METHOD HANDLING =====
function togglePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const allDetailSections = document.querySelectorAll('.payment-detail-section');
    
    // Hide all payment detail sections
    allDetailSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show relevant section based on selected method
    switch (selectedMethod) {
        case 'mobile':
            document.getElementById('mobilePaymentDetails').style.display = 'block';
            break;
        case 'bank':
            document.getElementById('bankPaymentDetails').style.display = 'block';
            break;
        case 'card':
            document.getElementById('cardPaymentDetails').style.display = 'block';
            break;
        case 'cod':
        default:
            // No additional details needed for COD
            break;
    }
}

function updateMobilePaymentInfo() {
    const selectedProvider = document.querySelector('input[name="mobileProvider"]:checked');
    if (selectedProvider) {
        showToast(`Selected ${selectedProvider.value.toUpperCase()} for payment`, 'info');
    }
}

// ===== PROMO CODE HANDLING =====
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        showToast('Please enter a promo code', 'error');
        return;
    }
    
    if (appliedPromo && appliedPromo.code === promoCode) {
        showToast('This promo code is already applied', 'info');
        return;
    }
    
    const promo = promoCodes[promoCode];
    
    if (!promo) {
        showToast('Invalid promo code', 'error');
        promoInput.focus();
        return;
    }
    
    if (orderData.subtotal < promo.minOrder) {
        showToast(`Minimum order of ৳${promo.minOrder} required for this promo code`, 'error');
        return;
    }
    
    // Apply discount
    if (promo.type === 'percentage') {
        orderData.discount = Math.round((orderData.subtotal * promo.discount) / 100);
    } else {
        orderData.discount = promo.discount;
    }
    
    appliedPromo = { code: promoCode, ...promo };
    
    // Update UI
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discount').textContent = `-৳${orderData.discount}`;
    
    // Change apply button to remove button
    const applyBtn = document.querySelector('.promo-input button');
    applyBtn.textContent = 'Remove';
    applyBtn.onclick = removePromoCode;
    
    promoInput.disabled = true;
    calculateTotal();
    
    showToast(`Promo code applied! You saved ৳${orderData.discount}`, 'success');
}

function removePromoCode() {
    appliedPromo = null;
    orderData.discount = 0;
    
    // Update UI
    document.getElementById('discountRow').style.display = 'none';
    document.getElementById('discount').textContent = '-৳0';
    
    // Reset apply button
    const applyBtn = document.querySelector('.promo-input button');
    const promoInput = document.getElementById('promoCode');
    
    applyBtn.textContent = 'Apply';
    applyBtn.onclick = applyPromoCode;
    promoInput.disabled = false;
    promoInput.value = '';
    
    calculateTotal();
    showToast('Promo code removed', 'info');
}

// ===== TOTAL CALCULATION =====
function calculateTotal() {
    orderData.total = orderData.subtotal + orderData.deliveryFee - orderData.discount;
    document.getElementById('total').textContent = `৳${orderData.total.toLocaleString()}`;
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('invalid', function(e) {
            e.preventDefault();
            validateField.call(this);
        });
    });
}

function validateField() {
    const field = this;
    const fieldGroup = field.closest('.form-group');
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    
    // Remove existing validation classes
    fieldGroup.classList.remove('error', 'success');
    
    // Remove existing error messages
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (fieldType === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (field.name === 'phone' && fieldValue) {
        const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
        if (!phoneRegex.test(fieldValue.replace(/[\s-]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid Bangladeshi phone number';
        }
    }
    
    // Card number validation
    else if (field.name === 'cardNumber' && fieldValue) {
        const cardNumber = fieldValue.replace(/\s/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            isValid = false;
            errorMessage = 'Please enter a valid card number';
        }
    }
    
    // Expiry date validation
    else if (field.name === 'expiryDate' && fieldValue) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter expiry date in MM/YY format';
        } else {
            const [month, year] = fieldValue.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                isValid = false;
                errorMessage = 'Card has expired';
            }
        }
    }
    
    // CVV validation
    else if (field.name === 'cvv' && fieldValue) {
        if (fieldValue.length < 3 || fieldValue.length > 4) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV';
        }
    }
    
    // Update field appearance
    if (isValid) {
        fieldGroup.classList.add('success');
    } else {
        fieldGroup.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        fieldGroup.appendChild(errorElement);
    }
    
    return isValid;
}

function clearFieldError() {
    const fieldGroup = this.closest('.form-group');
    fieldGroup.classList.remove('error');
    const errorMessage = fieldGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ===== CARD FORMATTING =====
function setupCardFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}

function formatCardNumber() {
    let value = this.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.value = value;
}

function formatExpiryDate() {
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.value = value;
}

// ===== FORM SUBMISSION =====
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate all required fields
    const form = e.target;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField.call(field)) {
            isFormValid = false;
        }
    });
    
    // Check terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showToast('Please agree to the Terms and Conditions', 'error');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        showToast('Please fix the errors in the form', 'error');
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading
    const submitBtn = document.getElementById('placeOrderBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    submitBtn.classList.add('loading');
    loadingOverlay.classList.add('active');
    
    // Collect form data
    const formData = new FormData(form);
    const orderDetails = collectOrderDetails(formData);
    
    // Simulate order processing
    setTimeout(() => {
        processOrder(orderDetails);
    }, 3000);
}

function collectOrderDetails(formData) {
    const orderDetails = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            area: formData.get('area'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country'),
            addressType: formData.get('addressType')
        },
        delivery: {
            method: formData.get('deliveryMethod'),
            fee: orderData.deliveryFee
        },
        payment: {
            method: formData.get('paymentMethod'),
            mobileProvider: formData.get('mobileProvider'),
            mobileNumber: formData.get('mobileNumber'),
            transactionId: formData.get('transactionId')
        },
        order: {
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryFee: orderData.deliveryFee,
            discount: orderData.discount,
            total: orderData.total,
            promoCode: appliedPromo ? appliedPromo.code : null
        },
        notes: formData.get('orderNotes'),
        newsletter: formData.get('subscribeNewsletter') === 'on',
        timestamp: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    return orderDetails;
}

function processOrder(orderDetails) {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('blkpaper-orders') || '[]');
    orders.push(orderDetails);
    localStorage.setItem('blkpaper-orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('blkpaper-cart');
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderDetails);
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/+8801XXXXXXXXX?text=${encodedMessage}`;
    
    // Hide loading
    const submitBtn = document.getElementById('placeOrderBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    submitBtn.classList.remove('loading');
    loadingOverlay.classList.remove('active');
    
    // Show success message
    showToast('Order placed successfully! Redirecting to WhatsApp...', 'success');
    
    // Redirect to WhatsApp after delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        // Redirect to success page or home
        window.location.href = 'index.html?order=success&id=' + orderDetails.orderId;
    }, 2000);
}

function createWhatsAppMessage(orderDetails) {
    const customer = orderDetails.customer;
    const shipping = orderDetails.shipping;
    const order = orderDetails.order;
    
    let message = `🛍️ *New Order from BlkPaper*\n\n`;
    message += `📋 *Order ID:* ${orderDetails.orderId}\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString()}\n\n`;
    
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${customer.firstName} ${customer.lastName}\n`;
    message += `Email: ${customer.email}\n`;
    message += `Phone: ${customer.phone}\n\n`;
    
    message += `📦 *Shipping Address:*\n`;
    message += `${shipping.address}\n`;
    message += `${shipping.area}, ${shipping.city}\n`;
    if (shipping.postalCode) message += `Postal Code: ${shipping.postalCode}\n`;
    message += `Address Type: ${shipping.addressType}\n\n`;
    
    message += `🛒 *Order Items:*\n`;
    order.items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ৳${(item.price * item.quantity).toLocaleString()}\n`;
        if (item.color) message += `  Color: ${item.color}\n`;
        if (item.size) message += `  Size: ${item.size}\n`;
    });
    
    message += `\n💰 *Order Summary:*\n`;
    message += `Subtotal: ৳${order.subtotal.toLocaleString()}\n`;
    message += `Delivery: ৳${order.deliveryFee}\n`;
    if (order.discount > 0) {
        message += `Discount: -৳${order.discount}\n`;
        if (order.promoCode) message += `Promo Code: ${order.promoCode}\n`;
    }
    message += `*Total: ৳${order.total.toLocaleString()}*\n\n`;
    
    message += `🚚 *Delivery:* ${orderDetails.delivery.method}\n`;
    message += `💳 *Payment:* ${orderDetails.payment.method.toUpperCase()}`;
    
    if (orderDetails.payment.method === 'mobile' && orderDetails.payment.mobileProvider) {
        message += ` (${orderDetails.payment.mobileProvider.toUpperCase()})`;
    }
    
    if (orderDetails.notes) {
        message += `\n\n📝 *Special Instructions:*\n${orderDetails.notes}`;
    }
    
    message += `\n\nPlease confirm this order. Thank you! 🙏`;
    
    return message;
}

// ===== UTILITY FUNCTIONS =====
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `BLK${timestamp}${random}`;
}

function goBackToCart() {
    window.history.back();
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

// ===== MODAL FUNCTIONS =====
function openTermsModal() {
    const modal = document.getElementById('termsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleModalClicks(e) {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ===== ORDER SUMMARY UPDATES =====
function updateOrderSummary() {
    displayOrderItems();
    calculateSubtotal();
    calculateTotal();
}

// ===== RESPONSIVE FEATURES =====
function handleResize() {
    const checkoutContainer = document.querySelector('.checkout-container');
    const orderSummary = document.querySelector('.order-summary-section');
    
    if (window.innerWidth <= 768) {
        // Mobile: Move order summary to top
        if (orderSummary && checkoutContainer.firstElementChild !== orderSummary) {
            checkoutContainer.insertBefore(orderSummary, checkoutContainer.firstElementChild);
        }
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Call on load

// ===== AUTO-SAVE DRAFT =====
function saveDraft() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    localStorage.setItem('checkout-draft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('checkout-draft');
    if (draft) {
        const draftData = JSON.parse(draft);
        const form = document.getElementById('checkoutForm');
        
        Object.keys(draftData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'radio' || field.type === 'checkbox') {
                    if (field.value === draftData[key] || draftData[key] === 'on') {
                        field.checked = true;
                    }
                } else {
                    field.value = draftData[key];
                }
            }
        });
        
        // Trigger change events to update UI
        updateDeliveryFee();
        togglePaymentDetails();
    }
}

// Save draft on form changes
document.addEventListener('change', saveDraft);
document.addEventListener('input', saveDraft);

// Load draft on page load
loadDraft();

// ===== ADDRESS VALIDATION =====
function validateBangladeshiAddress() {
    const city = document.getElementById('city').value;
    const area = document.getElementById('area').value;
    
    // You can add more sophisticated address validation here
    // For now, just basic validation
    
    return city && area;
}

// ===== DELIVERY TIME ESTIMATION =====
function estimateDeliveryDate() {
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const city = document.getElementById('city').value;
    
    const today = new Date();
    let deliveryDate = new Date(today);
    
    switch (deliveryMethod) {
        case 'standard':
            deliveryDate.setDate(today.getDate() + (city === 'dhaka' ? 3 : 5));
            break;
        case 'express':
            deliveryDate.setDate(today.getDate() + (city === 'dhaka' ? 1 : 2));
            break;
        case 'overnight':
            deliveryDate.setDate(today.getDate() + 1);
            break;
    }
    
    return deliveryDate.toLocaleDateString('en-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== ANALYTICS TRACKING =====
function trackCheckoutStep(step, additionalData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'checkout_progress', {
            checkout_step: step,
            currency: 'BDT',
            value: orderData.total,
            ...additionalData
        });
    }
    
    console.log(`Checkout Step: ${step}`, additionalData);
}

// Track initial checkout page load
trackCheckoutStep(1, { items: orderData.items.length });

// ===== ACCESSIBILITY FEATURES =====
function setupAccessibility() {
    // Add ARIA labels for form validation
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            const labelText = label.textContent.trim();
            input.setAttribute('aria-label', labelText);
        }
    });
    
    // Announce validation errors to screen readers
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const errorMessages = document.querySelectorAll('.error-message');
                errorMessages.forEach(error => {
                    error.setAttribute('role', 'alert');
                    error.setAttribute('aria-live', 'polite');
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize accessibility features
setupAccessibility();

// ===== PRINT FUNCTIONALITY =====
function printOrderSummary() {
    window.print();
}

// Add print button functionality if needed
const printBtn = document.getElementById('printBtn');
if (printBtn) {
    printBtn.addEventListener('click', printOrderSummary);
}