// This function runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // --- DYNAMIC NAVIGATION BAR ---
  // This part runs on every page to set the correct navigation links
  const navUl = document.querySelector('nav ul');
  if (navUl) {
    fetch('/api/user-status')
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          // User is logged in
          navUl.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="my-bookings.html">My Bookings</a></li>
            <li><a href="/logout">Logout</a></li>
          `;
        } else {
          // User is not logged in
          navUl.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
          `;
        }
      })
      .catch(error => console.error('Error fetching user status:', error));
  }


  // --- DYNAMIC CAR LISTING (for index.html) ---
  if (document.getElementById('car-listings')) {
    fetch('/api/cars')
      .then(response => response.json())
      .then(cars => {
        const carListings = document.getElementById('car-listings');
        if (cars.length === 0) {
          carListings.innerHTML = "<p>No cars available at the moment. Please check back later.</p>";
          return;
        }
        carListings.innerHTML = ''; // Clear loading message
        cars.forEach(car => {
          const carCard = `
            <div class="car-card">
              <img src="${car.image || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}" alt="${car.name}" />
              <h3>${car.name}</h3>
              <p>Price per day: ₹${car.price_per_day}</p>
              <a href="book.html?carId=${car.id}"><button>Book Now</button></a>
            </div>
          `;
          carListings.innerHTML += carCard;
        });
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
        document.getElementById('car-listings').innerHTML = "<p>Could not load cars. Please try again later.</p>";
      });
  }


  // --- BOOKING PAGE LOGIC (for book.html) ---
  if (window.location.pathname.endsWith("book.html")) {
    const carSelectElement = document.getElementById('carId');
    const urlParams = new URLSearchParams(window.location.search);
    const carIdFromURL = urlParams.get('carId');

    // Fetch all cars to populate the dropdown
    fetch('/api/cars')
      .then(response => response.json())
      .then(cars => {
        cars.forEach(car => {
          const option = document.createElement('option');
          option.value = car.id;
          option.textContent = `${car.name} (₹${car.price_per_day}/day)`;
          carSelectElement.appendChild(option);
        });
        // If a car was pre-selected from the homepage, set it as the default
        if (carIdFromURL) {
          carSelectElement.value = carIdFromURL;
        }
      });

    // Date validation
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);

    startDateInput.addEventListener('change', () => {
      if (startDateInput.value) {
        endDateInput.setAttribute('min', startDateInput.value);
      }
    });
  }


  // --- MY BOOKINGS PAGE LOGIC (for my-bookings.html) ---
  if (document.getElementById('bookings-container')) {
    fetch('/api/my-bookings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Not logged in');
        }
        return response.json();
      })
      .then(bookings => {
        const bookingsContainer = document.getElementById('bookings-container');
        if (bookings.length === 0) {
          bookingsContainer.innerHTML = "<p>You have no bookings.</p>";
          return;
        }
        bookingsContainer.innerHTML = ''; // Clear loading message
        bookings.forEach(booking => {
          const bookingCard = `
            <div class="booking-card">
              <img src="${booking.Car.image || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}" alt="${booking.Car.name}" />
              <div class="booking-details">
                  <h4>${booking.Car.name}</h4>
                  <p><strong>From:</strong> ${booking.startDate}</p>
                  <p><strong>To:</strong> ${booking.endDate}</p>
              </div>
            </div>
          `;
          bookingsContainer.innerHTML += bookingCard;
        });
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        const bookingsContainer = document.getElementById('bookings-container');
        // If the error is "Not logged in", redirect to the login page
        if (error.message.includes('Not logged in')) {
            window.location.href = '/login.html';
        } else {
            bookingsContainer.innerHTML = "<p>Could not load your bookings. Please try again later.</p>";
        }
      });
  }

});
