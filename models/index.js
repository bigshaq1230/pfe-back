import { sequelize, testConnection } from '../config/database.js'; // Import testConnection
import User from './user.js';
// Initialize models
const models = {
  User
};

// Sync database (be careful in production)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

export {
  sequelize,
  models,
  syncDatabase,
  testConnection,
  User
};