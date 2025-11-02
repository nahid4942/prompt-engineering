// BusFinder - Smart Bus Route & Booking System JavaScript

// ===== GLOBAL VARIABLES =====
let currentLanguage = 'en';
let searchResults = [];
let selectedFilters = {
    busClass: [],
    departureTime: [],
    operators: [],
    priceRange: 5000
};

// Sample data for demonstration
const bangladeshCities = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
    'Comilla', 'Bogra', 'Jessore', 'Dinajpur', 'Kushtia', 'Narayanganj', 'Faridpur', 'Pabna',
    'Tangail', 'Jamalpur', 'Kishoreganj', 'Manikganj', 'Narsingdi', 'Munshiganj', 'Gazipur',
    'Netrokona', 'Sherpur', 'Brahmanbaria', 'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sirajganj',
    'Natore', 'Naogaon', 'Chapainawabganj', 'Joypurhat', 'Thakurgaon', 'Panchagarh', 'Nilphamari',
    'Lalmonirhat', 'Kurigram', 'Gaibandha', 'Pirojpur', 'Jhalokati', 'Patuakhali', 'Barguna',
    'Bhola', 'Satkhira', 'Bagerhat', 'Magura', 'Narail', 'Chuadanga', 'Meherpur', 'Jhenaidah'
];

const busOperators = [
    { id: 'green-line', name: 'Green Line', logo: '🚌', rating: 4.5, routes: 45 },
    { id: 'shohagh', name: 'Shohagh Paribahan', logo: '🚍', rating: 4.2, routes: 38 },
    { id: 'hanif', name: 'Hanif Enterprise', logo: '🚐', rating: 4.3, routes: 42 },
    { id: 'ena', name: 'Ena Transport', logo: '🚌', rating: 4.1, routes: 35 },
    { id: 'national', name: 'National Travel', logo: '🚍', rating: 4.0, routes: 28 },
    { id: 'tr-travels', name: 'TR Travels', logo: '🚐', rating: 4.4, routes: 32 }
];

const popularRoutes = [
    { from: 'Dhaka', to: 'Chittagong', distance: '264 km', duration: '5h 30m', fare: '৳450-800', operators: 15 },
    { from: 'Dhaka', to: 'Sylhet', distance: '247 km', duration: '4h 45m', fare: '৳400-750', operators: 12 },
    { from: 'Dhaka', to: 'Rajshahi', distance: '256 km', duration: '5h 15m', fare: '৳420-780', operators: 10 },
    { from: 'Dhaka', to: 'Khulna', distance: '334 km', duration: '6h 20m', fare: '৳480-850', operators: 8 },
    { from: 'Chittagong', to: 'Sylhet', distance: '195 km', duration: '4h 15m', fare: '৳380-680', operators: 6 },
    { from: 'Dhaka', to: 'Rangpur', distance: '303 km', duration: '5h 45m', fare: '৳460-820', operators: 9 }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    hideLoadingScreen();
    setupEventListeners();
    setupDateInputs();
    populatePopularRoutes();
    populateOperators();
    setupLocationAutocomplete();
    initializeMap();
}

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Search form submission
    const searchForm = document.getElementById('busSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleBusSearch);
    }

    // Trip type change
    const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', handleTripTypeChange);
    });

    // Quick filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', handleQuickFilter);
    });

    // View toggles
    const viewToggles = document.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', handleViewToggle);
    });

    // Filter inputs
    setupFilterListeners();

    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', handlePriceRangeChange);
    }

    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);

    // Popular route cards
    setupRouteCardListeners();
}

function setupFilterListeners() {
    // Bus class filters
    const busClassFilters = document.querySelectorAll('input[name="busClass"]');
    busClassFilters.forEach(filter => {
        filter.addEventListener('change', () => updateFilters('busClass', filter.value, filter.checked));
    });

    // Departure time filters
    const timeFilters = document.querySelectorAll('input[name="departureTime"]');
    timeFilters.forEach(filter => {
        filter.addEventListener('change', () => updateFilters('departureTime', filter.value, filter.checked));
    });

    // Operator filters
    const operatorFilters = document.querySelectorAll('input[name="operator"]');
    operatorFilters.forEach(filter => {
        filter.addEventListener('change', () => updateFilters('operators', filter.value, filter.checked));
    });
}

// ===== SEARCH FUNCTIONALITY =====
function handleBusSearch(e) {
    e.preventDefault();
    
    const formData = {
        from: document.getElementById('fromLocation').value,
        to: document.getElementById('toLocation').value,
        departureDate: document.getElementById('departureDate').value,
        returnDate: document.getElementById('returnDate').value,
        passengers: document.getElementById('passengers').value,
        tripType: document.querySelector('input[name="tripType"]:checked').value
    };

    if (!formData.from || !formData.to || !formData.departureDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading and search results
    showSearchResults();
    generateSampleResults(formData);
}

function generateSampleResults(searchData) {
    const sampleBuses = [
        {
            id: 1,
            operator: 'Green Line',
            operatorId: 'green-line',
            logo: '🚌',
            class: ['AC', 'Luxury'],
            rating: 4.5,
            reviews: 142,
            departureTime: '08:30',
            arrivalTime: '14:15',
            duration: '5h 45m',
            fare: 750,
            seatsAvailable: 12,
            route: `${searchData.from} → ${searchData.to}`,
            stops: 3,
            amenities: ['WiFi', 'Charging Port', 'Blanket', 'Water']
        },
        {
            id: 2,
            operator: 'Shohagh Paribahan',
            operatorId: 'shohagh',
            logo: '🚍',
            class: ['AC'],
            rating: 4.2,
            reviews: 98,
            departureTime: '10:15',
            arrivalTime: '16:30',
            duration: '6h 15m',
            fare: 650,
            seatsAvailable: 8,
            route: `${searchData.from} → ${searchData.to}`,
            stops: 5,
            amenities: ['WiFi', 'Charging Port']
        },
        {
            id: 3,
            operator: 'Hanif Enterprise',
            operatorId: 'hanif',
            logo: '🚐',
            class: ['Non-AC'],
            rating: 4.3,
            reviews: 76,
            departureTime: '14:45',
            arrivalTime: '20:15',
            duration: '5h 30m',
            fare: 450,
            seatsAvailable: 18,
            route: `${searchData.from} → ${searchData.to}`,
            stops: 2,
            amenities: ['Charging Port']
        },
        {
            id: 4,
            operator: 'Ena Transport',
            operatorId: 'ena',
            logo: '🚌',
            class: ['AC', 'Luxury'],
            rating: 4.1,
            reviews: 134,
            departureTime: '22:30',
            arrivalTime: '05:15',
            duration: '6h 45m',
            fare: 800,
            seatsAvailable: 6,
            route: `${searchData.from} → ${searchData.to}`,
            stops: 1,
            amenities: ['WiFi', 'Charging Port', 'Blanket', 'Meals', 'Entertainment']
        }
    ];

    searchResults = sampleBuses;
    renderSearchResults();
    updateResultsCount();
}

function renderSearchResults() {
    const resultsContainer = document.getElementById('resultsList');
    if (!resultsContainer) return;

    const filteredResults = applyFilters(searchResults);
    
    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No buses found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = filteredResults.map(bus => createBusCard(bus)).join('');
    
    // Add event listeners to new cards
    setupBusCardListeners();
}

function createBusCard(bus) {
    const classTagsHTML = bus.class.map(cls => {
        const className = cls.toLowerCase().replace('/', '-');
        return `<span class="class-tag ${className}">${cls}</span>`;
    }).join('');

    const starsHTML = Array.from({length: 5}, (_, i) => {
        return i < Math.floor(bus.rating) ? '★' : '☆';
    }).join('');

    return `
        <div class="bus-card" data-bus-id="${bus.id}">
            <div class="bus-header">
                <div class="bus-operator">
                    <div class="operator-logo">${bus.logo}</div>
                    <div class="operator-info">
                        <h3>${bus.operator}</h3>
                        <div class="bus-class">${classTagsHTML}</div>
                    </div>
                </div>
                <div class="bus-rating">
                    <span class="rating-stars">${starsHTML}</span>
                    <span class="rating-score">${bus.rating}</span>
                    <span class="rating-count">(${bus.reviews})</span>
                </div>
            </div>
            
            <div class="bus-details">
                <div class="departure">
                    <div class="time">${bus.departureTime}</div>
                    <div class="location">${bus.route.split(' → ')[0]}</div>
                    <div class="date">${getCurrentDate()}</div>
                </div>
                
                <div class="journey-info">
                    <div class="duration">${bus.duration}</div>
                    <div class="route-line"></div>
                    <div class="stops">${bus.stops} stops</div>
                </div>
                
                <div class="arrival">
                    <div class="time">${bus.arrivalTime}</div>
                    <div class="location">${bus.route.split(' → ')[1]}</div>
                    <div class="date">${getCurrentDate()}</div>
                </div>
            </div>
            
            <div class="bus-footer">
                <div class="fare-info">
                    <div class="fare">৳${bus.fare}</div>
                    <div class="seats-available">${bus.seatsAvailable} seats left</div>
                </div>
                <div class="bus-actions">
                    <button class="btn btn-details" onclick="showBusDetails(${bus.id})">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                    <button class="btn btn-select" onclick="selectBus(${bus.id})">
                        <i class="fas fa-check"></i>
                        Select Seats
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== FILTER FUNCTIONALITY =====
function updateFilters(filterType, value, isChecked) {
    if (isChecked) {
        if (!selectedFilters[filterType].includes(value)) {
            selectedFilters[filterType].push(value);
        }
    } else {
        selectedFilters[filterType] = selectedFilters[filterType].filter(item => item !== value);
    }
    
    renderSearchResults();
}

function applyFilters(buses) {
    return buses.filter(bus => {
        // Bus class filter
        if (selectedFilters.busClass.length > 0) {
            const hasMatchingClass = selectedFilters.busClass.some(filterClass => {
                return bus.class.some(busClass => {
                    if (filterClass === 'ac') return busClass === 'AC';
                    if (filterClass === 'non-ac') return busClass === 'Non-AC';
                    if (filterClass === 'luxury') return busClass === 'Luxury';
                    if (filterClass === 'standard') return !bus.class.includes('Luxury');
                    return false;
                });
            });
            if (!hasMatchingClass) return false;
        }

        // Price filter
        if (bus.fare > selectedFilters.priceRange) return false;

        // Operator filter
        if (selectedFilters.operators.length > 0) {
            if (!selectedFilters.operators.includes(bus.operatorId)) return false;
        }

        // Time filter
        if (selectedFilters.departureTime.length > 0) {
            const hour = parseInt(bus.departureTime.split(':')[0]);
            const hasMatchingTime = selectedFilters.departureTime.some(timeSlot => {
                if (timeSlot === 'morning') return hour >= 6 && hour < 12;
                if (timeSlot === 'afternoon') return hour >= 12 && hour < 18;
                if (timeSlot === 'evening') return hour >= 18 && hour < 22;
                if (timeSlot === 'night') return hour >= 22 || hour < 6;
                return false;
            });
            if (!hasMatchingTime) return false;
        }

        return true;
    });
}

function handlePriceRangeChange(e) {
    selectedFilters.priceRange = parseInt(e.target.value);
    document.getElementById('maxPrice').textContent = `৳${e.target.value}`;
    renderSearchResults();
}

function clearAllFilters() {
    selectedFilters = {
        busClass: [],
        departureTime: [],
        operators: [],
        priceRange: 5000
    };
    
    // Reset UI
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('priceRange').value = 5000;
    document.getElementById('maxPrice').textContent = '৳5000';
    
    renderSearchResults();
}

// ===== UI FUNCTIONALITY =====
function handleTripTypeChange(e) {
    const returnDateGroup = document.getElementById('returnDateGroup');
    if (e.target.value === 'round-trip') {
        returnDateGroup.style.display = 'block';
    } else {
        returnDateGroup.style.display = 'none';
    }
}

function handleQuickFilter(e) {
    const filterType = e.currentTarget.dataset.filter;
    e.currentTarget.classList.toggle('active');
    
    // Apply quick filter logic
    switch(filterType) {
        case 'ac':
            toggleFilter('busClass', 'ac');
            break;
        case 'luxury':
            toggleFilter('busClass', 'luxury');
            break;
        case 'overnight':
            toggleFilter('departureTime', 'night');
            break;
        case 'direct':
            // Filter for buses with minimum stops
            break;
    }
}

function toggleFilter(filterType, value) {
    const index = selectedFilters[filterType].indexOf(value);
    if (index > -1) {
        selectedFilters[filterType].splice(index, 1);
    } else {
        selectedFilters[filterType].push(value);
    }
    renderSearchResults();
}

function handleViewToggle(e) {
    const viewType = e.currentTarget.dataset.view;
    
    // Update active state
    document.querySelectorAll('.view-toggle').forEach(toggle => {
        toggle.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show/hide appropriate content
    const listView = document.getElementById('resultsList');
    const mapView = document.getElementById('mapContainer');
    
    if (viewType === 'list') {
        listView.style.display = 'block';
        mapView.style.display = 'none';
    } else {
        listView.style.display = 'none';
        mapView.style.display = 'block';
        updateMapView();
    }
}

function toggleFilters() {
    const sidebar = document.getElementById('filtersSidebar');
    sidebar.classList.toggle('show');
}

function showSearchResults() {
    const resultsSection = document.getElementById('searchResults');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateResultsCount() {
    const filteredResults = applyFilters(searchResults);
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `Found ${filteredResults.length} buses for your journey`;
    }
}

// ===== LOCATION AUTOCOMPLETE =====
function setupLocationAutocomplete() {
    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');
    const fromSuggestions = document.getElementById('fromSuggestions');
    const toSuggestions = document.getElementById('toSuggestions');

    if (fromInput && fromSuggestions) {
        setupAutocomplete(fromInput, fromSuggestions);
    }
    
    if (toInput && toSuggestions) {
        setupAutocomplete(toInput, toSuggestions);
    }
}

function setupAutocomplete(input, suggestionsContainer) {
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const matches = bangladeshCities.filter(city => 
            city.toLowerCase().includes(query)
        ).slice(0, 6);

        if (matches.length > 0) {
            suggestionsContainer.innerHTML = matches.map(city => 
                `<div class="suggestion-item" onclick="selectLocation('${input.id}', '${city}')">${city}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function selectLocation(inputId, city) {
    document.getElementById(inputId).value = city;
    document.querySelector(`#${inputId} + .location-suggestions`).style.display = 'none';
}

function swapLocations() {
    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');
    
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
}

// ===== DATE SETUP =====
function setupDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const departureInput = document.getElementById('departureDate');
    const returnInput = document.getElementById('returnDate');
    
    if (departureInput) {
        departureInput.min = formatDate(today);
        departureInput.value = formatDate(today);
    }
    
    if (returnInput) {
        returnInput.min = formatDate(tomorrow);
        returnInput.value = formatDate(tomorrow);
    }
}

// ===== POPULAR ROUTES =====
function populatePopularRoutes() {
    const routesContainer = document.getElementById('popularRoutes');
    if (!routesContainer) return;

    routesContainer.innerHTML = popularRoutes.map(route => `
        <div class="route-card" onclick="searchRoute('${route.from}', '${route.to}')">
            <div class="route-destinations">
                <span class="destination">${route.from}</span>
                <i class="fas fa-arrow-right route-arrow"></i>
                <span class="destination">${route.to}</span>
            </div>
            <div class="route-info">
                <div class="info-item">
                    <i class="fas fa-road"></i>
                    <span>${route.distance}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${route.duration}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-bus"></i>
                    <span>${route.operators} operators</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>Popular</span>
                </div>
            </div>
            <div class="route-fare">From ${route.fare}</div>
            <button class="btn btn-primary" onclick="event.stopPropagation(); searchRoute('${route.from}', '${route.to}')">
                Search Buses
            </button>
        </div>
    `).join('');
}

function searchRoute(from, to) {
    document.getElementById('fromLocation').value = from;
    document.getElementById('toLocation').value = to;
    document.getElementById('busSearchForm').scrollIntoView({ behavior: 'smooth' });
}

// ===== OPERATORS =====
function populateOperators() {
    const operatorsContainer = document.getElementById('operatorsGrid');
    if (!operatorsContainer) return;

    operatorsContainer.innerHTML = busOperators.map(operator => `
        <div class="operator-card">
            <div class="operator-card-logo">${operator.logo}</div>
            <h3>${operator.name}</h3>
            <div class="operator-stats">
                <div class="stat-item">
                    <div class="stat-value">${operator.rating}</div>
                    <div class="stat-label">Rating</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${operator.routes}</div>
                    <div class="stat-label">Routes</div>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="filterByOperator('${operator.id}')">
                View Buses
            </button>
        </div>
    `).join('');
}

function filterByOperator(operatorId) {
    // Set operator filter and show results
    selectedFilters.operators = [operatorId];
    document.querySelector(`input[value="${operatorId}"]`).checked = true;
    
    // Scroll to results or trigger search
    if (searchResults.length > 0) {
        renderSearchResults();
        document.getElementById('searchResults').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== MAP FUNCTIONALITY =====
let map;

function initializeMap() {
    // Initialize Leaflet map when needed
    if (typeof L !== 'undefined') {
        map = L.map('busRouteMap').setView([23.8103, 90.4125], 7); // Bangladesh center
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

function updateMapView() {
    if (!map) return;
    
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Add sample route markers
    const dhaka = L.marker([23.8103, 90.4125]).addTo(map);
    const chittagong = L.marker([22.3569, 91.7832]).addTo(map);
    
    dhaka.bindPopup("<b>Dhaka</b><br>Departure: 08:30 AM");
    chittagong.bindPopup("<b>Chittagong</b><br>Arrival: 02:15 PM");
    
    // Draw route line
    const routeLine = L.polyline([
        [23.8103, 90.4125],
        [22.3569, 91.7832]
    ], {color: '#2563eb', weight: 4}).addTo(map);
    
    // Fit map to route
    map.fitBounds(routeLine.getBounds(), {padding: [20, 20]});
}

// ===== BOOKING FUNCTIONALITY =====
function selectBus(busId) {
    const bus = searchResults.find(b => b.id === busId);
    if (!bus) return;
    
    showBookingModal(bus);
}

function showBusDetails(busId) {
    const bus = searchResults.find(b => b.id === busId);
    if (!bus) return;
    
    // Show detailed information modal
    const modalBody = document.getElementById('bookingModalBody');
    modalBody.innerHTML = `
        <div class="bus-details-modal">
            <div class="operator-header">
                <div class="operator-logo">${bus.logo}</div>
                <div>
                    <h3>${bus.operator}</h3>
                    <p>${bus.class.join(', ')}</p>
                </div>
            </div>
            
            <div class="journey-details">
                <h4>Journey Details</h4>
                <div class="detail-row">
                    <span>Route:</span>
                    <span>${bus.route}</span>
                </div>
                <div class="detail-row">
                    <span>Duration:</span>
                    <span>${bus.duration}</span>
                </div>
                <div class="detail-row">
                    <span>Stops:</span>
                    <span>${bus.stops} intermediate stops</span>
                </div>
                <div class="detail-row">
                    <span>Fare:</span>
                    <span>৳${bus.fare}</span>
                </div>
            </div>
            
            <div class="amenities">
                <h4>Amenities</h4>
                <div class="amenity-list">
                    ${bus.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeBookingModal()">Close</button>
                <button class="btn btn-primary" onclick="selectBus(${bus.id})">Book Now</button>
            </div>
        </div>
    `;
    
    document.getElementById('bookingModal').classList.add('show');
}

function showBookingModal(bus) {
    const modalBody = document.getElementById('bookingModalBody');
    modalBody.innerHTML = `
        <div class="booking-form">
            <div class="selected-bus">
                <h4>Selected Bus</h4>
                <div class="bus-summary">
                    <div class="operator-info">
                        <span class="operator-logo">${bus.logo}</span>
                        <div>
                            <strong>${bus.operator}</strong>
                            <p>${bus.route}</p>
                        </div>
                    </div>
                    <div class="journey-time">
                        <div>${bus.departureTime} - ${bus.arrivalTime}</div>
                        <div class="fare">৳${bus.fare}</div>
                    </div>
                </div>
            </div>
            
            <div class="seat-selection">
                <h4>Select Seats</h4>
                <div class="seat-map">
                    ${generateSeatMap(bus.seatsAvailable)}
                </div>
            </div>
            
            <div class="passenger-info">
                <h4>Passenger Information</h4>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter passenger name" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter phone number" required>
                </div>
                <div class="form-group">
                    <label>Email (Optional)</label>
                    <input type="email" placeholder="Enter email address">
                </div>
            </div>
            
            <div class="booking-summary">
                <div class="summary-row">
                    <span>Base Fare:</span>
                    <span>৳${bus.fare}</span>
                </div>
                <div class="summary-row">
                    <span>Service Charge:</span>
                    <span>৳50</span>
                </div>
                <div class="summary-row total">
                    <span>Total Amount:</span>
                    <span>৳${bus.fare + 50}</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                <button class="btn btn-primary" onclick="proceedToPayment()">Proceed to Payment</button>
            </div>
        </div>
    `;
    
    document.getElementById('bookingModal').classList.add('show');
}

function generateSeatMap(availableSeats) {
    const totalSeats = 40;
    const seats = [];
    
    for (let i = 1; i <= totalSeats; i++) {
        const isAvailable = i <= availableSeats;
        const seatClass = isAvailable ? 'seat available' : 'seat occupied';
        seats.push(`<div class="${seatClass}" data-seat="${i}">${i}</div>`);
    }
    
    return `<div class="seats-grid">${seats.join('')}</div>`;
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('show');
}

function proceedToPayment() {
    showNotification('Redirecting to payment gateway...', 'success');
    // In a real app, this would integrate with payment providers
    setTimeout(() => {
        closeBookingModal();
        showNotification('Booking confirmed! E-ticket sent to your email.', 'success');
    }, 2000);
}

// ===== UTILITY FUNCTIONS =====
function getCurrentDate() {
    return new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        backgroundColor: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function setupBusCardListeners() {
    // Add hover effects and interactions to bus cards
    const busCards = document.querySelectorAll('.bus-card');
    busCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function setupRouteCardListeners() {
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== LANGUAGE TOGGLE =====
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    document.getElementById('langText').textContent = currentLanguage.toUpperCase();
    
    // In a real app, this would switch all text content
    showNotification(`Language switched to ${currentLanguage === 'en' ? 'English' : 'বাংলা'}`, 'info');
}

// ===== USER MENU =====
function toggleUserMenu() {
    showNotification('User menu - Login/Register functionality would be here', 'info');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('show');
}

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .seats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        max-width: 200px;
        margin: 0 auto;
    }
    
    .seat {
        width: 40px;
        height: 40px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
        font-weight: 500;
    }
    
    .seat.available {
        background: #f0fdf4;
        border-color: #22c55e;
        color: #16a34a;
    }
    
    .seat.available:hover {
        background: #22c55e;
        color: white;
    }
    
    .seat.occupied {
        background: #fef2f2;
        border-color: #ef4444;
        color: #dc2626;
        cursor: not-allowed;
    }
    
    .seat.selected {
        background: #2563eb;
        border-color: #2563eb;
        color: white;
    }
    
    .bus-details-modal .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .bus-details-modal .detail-row:last-child {
        border-bottom: none;
    }
    
    .amenity-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .amenity-tag {
        padding: 4px 12px;
        background: #e0f2fe;
        color: #0277bd;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 2px solid #f3f4f6;
    }
    
    .booking-summary {
        background: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    
    .summary-row.total {
        font-weight: 600;
        font-size: 1.1rem;
        padding-top: 8px;
        border-top: 2px solid #e5e7eb;
        margin-top: 8px;
    }
    
    .no-results {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-secondary);
    }
    
    .no-results h3 {
        margin-bottom: 12px;
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);