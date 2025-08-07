// This file defines the 'Car' model for the database.

module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The 'image' field will store a URL to the car's picture
    image: {
      type: DataTypes.STRING,
      allowNull: true // It's okay if a car doesn't have an image
    },
    // The 'price_per_day' field stores the rental cost
    price_per_day: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  // This function associates the Car model with the Booking model
  Car.associate = (models) => {
    // A Car can have many Bookings
    Car.hasMany(models.Booking);
  };

  return Car;
};
