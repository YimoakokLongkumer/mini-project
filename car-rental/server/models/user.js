// This file should export a function that defines the model.
// This function will be called automatically by 'models/index.js'.

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

  return User;
};
