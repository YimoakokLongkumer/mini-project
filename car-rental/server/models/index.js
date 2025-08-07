const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

// Import models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Booking = require('./booking')(sequelize, Sequelize.DataTypes);

// Define associations
// A user can have many bookings
User.hasMany(Booking);
// A booking belongs to one user
Booking.belongsTo(User);

// Export everything
module.exports = {
  sequelize,
  User,
  Booking
};
