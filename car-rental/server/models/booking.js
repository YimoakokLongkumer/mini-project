// This file defines the 'Booking' model.

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    // The old 'car' field has been removed.
    // The association below will automatically create a 'CarId' field.
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });

  // This function defines the model's relationships (associations)
  Booking.associate = (models) => {
    // A Booking belongs to one User
    Booking.belongsTo(models.User);
    // A Booking belongs to one Car
    Booking.belongsTo(models.Car);
  };

  return Booking;
};
