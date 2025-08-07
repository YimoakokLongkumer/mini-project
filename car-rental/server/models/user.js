// This file defines the 'User' model.

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // This function defines the model's relationships (associations)
  User.associate = (models) => {
    // A User can have many Bookings
    User.hasMany(models.Booking);
  };

  return User;
};
