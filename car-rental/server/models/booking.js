module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    car: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY, // Stores date as YYYY-MM-DD
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });

  return Booking;
};
