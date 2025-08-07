const User = require('./models/user');
const bcrypt = require('bcryptjs');

const express = require('express');           // Load Express framework
const bodyParser = require('body-parser');    // Read data from HTML forms
const mongoose = require('mongoose');         // MongoDB connector
const app = express();                        // Create Express app
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
 // Serve static files (like style.css)

// Routes (temporary test)
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'register.html'));
});

// ...existing code...


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



//for user registering

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.send("Registration successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
