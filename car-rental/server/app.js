// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
// Import all models and the sequelize instance from the updated index.js
const { sequelize, User, Booking, Car } = require('./models');

// Initialize Express app
const app = express();


// --- DATABASE CONNECTION ---
// Sync all defined models to the DB.
// Using { force: true } will drop the table if it already exists. Use with caution.
// We'll use { alter: true } which is safer as it tries to update tables without losing data.
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables updated!');
});


// --- MIDDLEWARE SETUP ---
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the root directory of the project
app.use(express.static(path.join(__dirname, '..')));
// This makes the 'public' folder accessible, e.g., for CSS and JS
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Session configuration
app.use(session({
  secret: 'a-super-secret-key-that-you-should-change', // Change this in a real application
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if you are using HTTPS
}));


// --- ROUTES ---

// Homepage route - serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// User Registration Logic
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.send("An account with this email already exists. Please <a href='/login.html'>login</a>.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.send("Registration successful! You can now <a href='/login.html'>login</a>.");
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).send("Server error during registration.");
  }
});

// User Login Logic
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send("Email not found. Please <a href='/register.html'>register</a> first.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Incorrect password. Please try again.");
    }
    // Store user's ID in the session to mark them as logged in
    req.session.userId = user.id;
    res.redirect('/index.html');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send("Server error during login.");
  }
});

// User Logout Logic
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // Handle error case
      console.error('Session Destroy Error:', err);
      return res.redirect('/');
    }
    // Clears the session cookie
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
});

// Booking Logic
app.post('/book', async (req, res) => {
  // 1. Check if the user is logged in
  if (!req.session.userId) {
    // If not, send them to the login page
    return res.redirect('/login.html');
  }

  // 2. Get booking details from the form
  const { carId, start_date, end_date } = req.body;
  const userId = req.session.userId;

  try {
    // 3. Create a new booking record in the database
    await Booking.create({
      startDate: start_date,
      endDate: end_date,
      UserId: userId, // Link the booking to the logged-in user
      CarId: carId    // Link the booking to the selected car
    });

    // 4. Redirect to a confirmation page
    res.redirect('/booking-confirmation.html');

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).send("Server error during booking.");
  }
});


// --- API ROUTES (for fetching data with JavaScript) ---

// API route to get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: "Server error fetching cars." });
  }
});

// API route to check if a user is logged in
app.get('/api/user-status', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// API route to get the current user's bookings
app.get('/api/my-bookings', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in." });
  }
  try {
    // Find all bookings for the current user and include the associated Car details
    const bookings = await Booking.findAll({
      where: { UserId: req.session.userId },
      include: [{
        model: Car,
        attributes: ['name', 'image'] // Only get the car's name and image
      }],
      order: [['startDate', 'DESC']] // Show the newest bookings first
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: "Server error fetching bookings." });
  }
});


// --- START THE SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
