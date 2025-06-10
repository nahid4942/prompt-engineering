// Simple "database" of hostels (copy from hostels.js or use shared storage if backend)
const hostelsDB = [
    {
        id: 1,
        name: "Sunny Hostel Paris",
        destination: "Paris",
        price: 45,
        rooms: 5,
        image: "images/paris-hostel.jpg",
        booked: false
    },
    {
        id: 2,
        name: "Tokyo Backpackers",
        destination: "Tokyo",
        price: 60,
        rooms: 3,
        image: "images/tokyo-hostel.jpg",
        booked: false
    },
    // ...add more as needed
];

// Admin: Add new hostel
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
        renderAdminHostels();
    }
};

// Initial render
renderAdminHostels();