// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models/user'); // Updated import

// Initialize Express app
const app = express();


// --- DATABASE CONNECTION (with Sequelize) ---
// This will create a 'database.sqlite' file in the 'server' folder
sequelize.sync().then(() => {
  console.log('Database & tables created!');
});


// --- MIDDLEWARE SETUP ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Session configuration
app.use(session({
  secret: 'your-very-secret-key-change-it',
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

// User Registration Logic
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.send("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.send("Registration successful! You can now <a href='/login.html'>login</a>.");
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).send("Server error during login.");
  }
});


// --- START THE SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
