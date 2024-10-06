// backend/src/sequelize.ts

import { Sequelize } from 'sequelize';
import User from './models/User';
import Address from './models/Address';
// import './models/association'; // Import associations
import './models/Associations';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'user_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Disable logging; enable if needed
  }
);

// Optionally, test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
