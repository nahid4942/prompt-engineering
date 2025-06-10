// Simple "database" of hostels
const hostelsDB = [
    {
        id: 1,
        name: "Sunny Hostel Paris",
        destination: "Paris",
        price: 45,
        rooms: 5,
        image: "images/paris-hostel.jpg"
    },
    {
        id: 2,
        name: "Tokyo Backpackers",
        destination: "Tokyo",
        price: 60,
        rooms: 3,
        image: "images/tokyo-hostel.jpg"
    },
    {
        id: 3,
        name: "Rome Central Hostel",
        destination: "Rome",
        price: 38,
        rooms: 8,
        image: "images/rome-hostel.jpg"
    },
    {
        id: 4,
        name: "Sydney Harbour Hostel",
        destination: "Sydney",
        price: 55,
        rooms: 4,
        image: "images/sydney-hostel.jpg"
    },
    {
        id: 5,
        name: "Cape Town Lodge",
        destination: "Cape Town",
        price: 30,
        rooms: 6,
        image: "images/cape-town-hostel.jpg"
    },
    {
        id: 6,
        name: "New York City Hostel",
        destination: "New York",
        price: 70,
        rooms: 2,
        image: "images/new-york-hostel.jpg"
    }
];

// Render hostel cards
function renderHostels(hostels) {
    const container = document.getElementById('hostelCards');
    container.innerHTML = '';
    if (hostels.length === 0) {
        container.innerHTML = '<p>No hostels found for your search.</p>';
        return;
    }
    hostels.forEach(h => {
        container.innerHTML += `
            <div class="destination-card">
                <img src="${h.image}" alt="${h.name}">
                <h3>${h.name}</h3>
                <p><strong>Destination:</strong> ${h.destination}</p>
                <p><strong>Price:</strong> $${h.price} per night</p>
                <p><strong>Rooms Available:</strong> ${h.rooms}</p>
                <p><strong>Status:</strong> <span style="color:${h.booked ? 'red' : 'green'}">${h.booked ? 'Booked' : 'Available'}</span></p>
                <button class="add-trip-btn" onclick="bookRoom(${h.id})" ${h.booked ? 'disabled' : ''}>Book Now</button>
            </div>
        `;
    });
}

// Booking logic (decrease room count)
function bookRoom(id) {
    const hostel = hostelsDB.find(h => h.id === id);
    if (hostel && hostel.rooms > 0) {
        hostel.rooms -= 1;
        alert(`Room booked at ${hostel.name}!`);
        renderHostels(filteredHostels); // update UI
    } else {
        alert('No rooms available!');
    }
}

// Search logic
let filteredHostels = hostelsDB;
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const people = parseInt(document.getElementById('people').value, 10);
    const dest = document.getElementById('destination').value.trim().toLowerCase();
    const budget = parseInt(document.getElementById('budget').value, 10);

    filteredHostels = hostelsDB.filter(h =>
        h.destination.toLowerCase().includes(dest) &&
        h.price <= budget &&
        h.rooms >= people
    );
    renderHostels(filteredHostels);
});

// Clear search functionality
document.getElementById('clearSearchBtn').addEventListener('click', function() {
    document.getElementById('people').value = 1;
    document.getElementById('destination').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('duration').value = 1;
    filteredHostels = hostelsDB;
    renderHostels(filteredHostels);
});

// Initial render
renderHostels(hostelsDB);

/* Admin Panel Section */
const adminPanelHTML = `
    <section id="admin-panel" style="margin-top:40px;">
        <h2>Admin Panel: Manage Hostels</h2>
        <form id="addHostelForm" class="hostel-search-form">
            <label>
                Name:
                <input type="text" id="admin-name" required>
            </label>
            <label>
                Destination:
                <input type="text" id="admin-destination" required>
            </label>
            <label>
                Price (per night):
                <input type="number" id="admin-price" min="1" required>
            </label>
            <label>
                Rooms Available:
                <input type="number" id="admin-rooms" min="1" required>
            </label>
            <label>
                Image URL:
                <input type="text" id="admin-image" required>
            </label>
            <button type="submit">Add Hostel</button>
        </form>
        <div id="admin-hostel-list" style="margin-top:32px;">
            <h3>Update Hostel Status</h3>
            <div id="admin-hostel-cards" class="destination-grid"></div>
        </div>
    </section>
`;
document.body.insertAdjacentHTML('beforeend', adminPanelHTML);

// Admin functionality (add new hostel)
document.getElementById('addHostelForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value.trim();
    const destination = document.getElementById('admin-destination').value.trim();
    const price = parseInt(document.getElementById('admin-price').value, 10);
    const rooms = parseInt(document.getElementById('admin-rooms').value, 10);
    const image = document.getElementById('admin-image').value.trim();

    if (!name || !destination || !price || !rooms || !image) {
        alert('Please fill all fields.');
        return;
    }

    const newHostel = {
        id: hostelsDB.length ? Math.max(...hostelsDB.map(h => h.id)) + 1 : 1,
        name,
        destination,
        price,
        rooms,
        image,
        booked: false
    };
    hostelsDB.push(newHostel);
    filteredHostels = hostelsDB;
    renderHostels(filteredHostels);
    renderAdminHostels();
    this.reset();
});

// Admin: Render hostel cards for update
function renderAdminHostels() {
    const adminList = document.getElementById('admin-hostel-cards');
    if (!adminList) return;
    adminList.innerHTML = '';
    hostelsDB.forEach(h => {
        adminList.innerHTML += `
            <div class="destination-card">
                <img src="${h.image}" alt="${h.name}">
                <h3>${h.name}</h3>
                <p><strong>Destination:</strong> ${h.destination}</p>
                <p><strong>Price:</strong> $${h.price} per night</p>
                <p><strong>Rooms:</strong> ${h.rooms}</p>
                <p><strong>Status:</strong> <span style="color:${h.booked ? 'red' : 'green'}">${h.booked ? 'Booked' : 'Available'}</span></p>
                <button onclick="toggleBooked(${h.id})">${h.booked ? 'Mark Available' : 'Mark Booked'}</button>
            </div>
        `;
    });
}

// Admin: Toggle booked status
window.toggleBooked = function(id) {
    const hostel = hostelsDB.find(h => h.id === id);
    if (hostel) {
        hostel.booked = !hostel.booked;
        renderHostels(filteredHostels);
        renderAdminHostels();
    }
};

// Update main hostel cards to show booked status
function renderHostels(hostels) {
    const container = document.getElementById('hostelCards');
    container.innerHTML = '';
    if (hostels.length === 0) {
        container.innerHTML = '<p>No hostels found for your search.</p>';
        return;
    }
    hostels.forEach(h => {
        container.innerHTML += `
            <div class="destination-card">
                <img src="${h.image}" alt="${h.name}">
                <h3>${h.name}</h3>
                <p><strong>Destination:</strong> ${h.destination}</p>
                <p><strong>Price:</strong> $${h.price} per night</p>
                <p><strong>Rooms Available:</strong> ${h.rooms}</p>
                <p><strong>Status:</strong> <span style="color:${h.booked ? 'red' : 'green'}">${h.booked ? 'Booked' : 'Available'}</span></p>
                <button class="add-trip-btn" onclick="bookRoom(${h.id})" ${h.booked ? 'disabled' : ''}>Book Now</button>
            </div>
        `;
    });
}

// Call admin render on load
renderAdminHostels();