// This script is for adding some initial car data to the database.
// Run this file once from your terminal: `node add-cars.js`

const { sequelize, Car } = require('./server/models');

const carsToAdd = [
  {
    name: 'Honda Civic',
    // This path is now relative to the 'public' folder.
    image: '/public/images/honda-civic.jpg',
    price_per_day: 3000
  },
  {
    name: 'Hyundai Creta',
    // This path is now relative to the 'public' folder.
    image: '/public/images/hyundai-creta.jpg',
    price_per_day: 4500
  },
  {
    name: 'Maruti Swift',
    // This path is now relative to the 'public' folder.
    image: '/public/images/maruti-swift.jpg',
    price_per_day: 2800
  }
];

// Sync the database and add the cars
sequelize.sync({ force: true }).then(async () => { // Using { force: true } to ensure a clean slate
  console.log('Database synced!');
  try {
    await Car.bulkCreate(carsToAdd);
    console.log('Cars have been added successfully!');
  } catch (error) {
    console.error('Error adding cars:', error);
  } finally {
    await sequelize.close();
  }
});
