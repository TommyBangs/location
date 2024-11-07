// Updated location data with categories
const legalLocations = {
    policeStations: [
        { 
            name: 'Central Police Station', 
            lat: 40.7128, 
            lng: -74.0060, 
            type: 'Police Station',
            address: '123 Main Street',
            phone: '(555) 123-4567'
        },
        { 
            name: 'North Precinct', 
            lat: 40.7580, 
            lng: -73.9855, 
            type: 'Police Station',
            address: '456 North Ave',
            phone: '(555) 234-5678'
        },
        // Add more police stations as needed
    ],
    legalHouses: [
        { 
            name: 'City Courthouse', 
            lat: 40.7246, 
            lng: -73.9962, 
            type: 'Courthouse',
            address: '789 Justice Blvd',
            phone: '(555) 345-6789'
        },
        { 
            name: 'Smith & Associates Law Firm', 
            lat: 40.7589, 
            lng: -73.9851, 
            type: 'Law Office',
            address: '321 Legal Lane',
            phone: '(555) 456-7890'
        },
        // Add more legal houses as needed
    ]
};

let map;
let userMarker;
let directionsService;
let directionsRenderer;

function initMap() {
    // Initialize Google Maps
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 40.7128, lng: -74.0060 }, // Default center (New York)
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Add user marker
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    title: 'Your Location'
                });

                map.setCenter(userLocation);
                populateLocations();
            },
            () => {
                console.error("Error: The Geolocation service failed.");
                populateLocations();
            }
        );
    } else {
        console.error("Error: Your browser doesn't support geolocation.");
        populateLocations();
    }
}

function populateLocations() {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = ''; // Clear existing content

    // Create category sections
    const categories = [
        { 
            title: 'Police Stations', 
            data: legalLocations.policeStations,
            icon: '👮‍♂️'
        },
        { 
            title: 'Legal Houses', 
            data: legalLocations.legalHouses,
            icon: '⚖️'
        }
    ];

    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'location-category';
        
        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <h2>${category.icon} ${category.title}</h2>
            <span class="location-count">${category.data.length}</span>
        `;
        
        categorySection.appendChild(categoryHeader);

        category.data.forEach(location => {
            // Create marker for each location
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.name
            });

            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h3>${location.name}</h3>
                        <p>${location.type}</p>
                        <button onclick="getDirections(${location.lat}, ${location.lng})">
                            Get Directions
                        </button>
                    </div>
                `
            });

            // Add click listener to marker
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            // Create location item in sidebar
            const locationItem = document.createElement('div');
            locationItem.className = 'location-item';
            locationItem.innerHTML = `
                <h3>${location.name}</h3>
                <p>${location.type}</p>
            `;
            
            locationItem.addEventListener('click', () => {
                map.setCenter({ lat: location.lat, lng: location.lng });
                infoWindow.open(map, marker);
            });

            categorySection.appendChild(locationItem);
        });

        locationList.appendChild(categorySection);
    });

    // Add search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const locationItems = document.getElementsByClassName('location-item');
        
        Array.from(locationItems).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

function getDirections(destLat, destLng) {
    if (!userMarker) {
        alert('Your location is not available');
        return;
    }

    const request = {
        origin: userMarker.getPosition(),
        destination: { lat: destLat, lng: destLng },
        travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Could not get directions: ' + status);
        }
    });
}

// Add this after your existing code
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-menu');
    
    sidebar.classList.toggle('collapsed');
    hamburger.classList.toggle('active');
});

// Close sidebar when clicking outside (on the map)
document.getElementById('map').addEventListener('click', function() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        sidebar.classList.add('collapsed');
        hamburger.classList.remove('active');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('collapsed');
        hamburger.classList.remove('active');
    }
}); 