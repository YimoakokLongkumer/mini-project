const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false // Set to true to see SQL queries in the console
});

// Create a db object to hold our models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Booking = require('./booking')(sequelize, Sequelize.DataTypes);
db.Car = require('./car')(sequelize, Sequelize.DataTypes); // Import the new Car model

// Define associations
// A user can have many bookings
db.User.hasMany(db.Booking);
db.Booking.belongsTo(db.User);

// A car can have many bookings
db.Car.hasMany(db.Booking);
db.Booking.belongsTo(db.Car);

// Export the db object
module.exports = db;
