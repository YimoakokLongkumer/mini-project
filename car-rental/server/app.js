// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
// Import all models and the sequelize instance
const { sequelize, User, Booking } = require('./models');

// Initialize Express app
const app = express();


// --- DATABASE CONNECTION ---
// Sync all defined models to the DB.
sequelize.sync().then(() => {
  console.log('Database & tables created!');
});


// --- MIDDLEWARE SETUP ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Session configuration
app.use(session({
  secret: 'a-super-secret-key-that-you-should-change',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// --- ROUTES ---

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Registration form route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'register.html'));
});

// Login form route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Booking form route
app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'book.html'));
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
    req.session.userId = user.id;
    res.redirect('/index.html');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send("Server error during login.");
  }
});

// ** NEW ** Booking Logic
app.post('/book', async (req, res) => {
  // 1. Check if the user is logged in
  if (!req.session.userId) {
    return res.redirect('/login.html'); // If not, send them to the login page
  }

  // 2. Get booking details from the form
  const { car, start_date, end_date } = req.body;
  const userId = req.session.userId;

  try {
    // 3. Create a new booking record in the database
    await Booking.create({
      car,
      startDate: start_date,
      endDate: end_date,
      UserId: userId // Link the booking to the logged-in user
    });

    // 4. Redirect to a confirmation page
    res.redirect('/booking-confirmation.html');

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).send("Server error during booking.");
  }
});


// --- START THE SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});