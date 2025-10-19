import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()

// Import database and models
import { testConnection, syncDatabase, User } from './models/index.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Waste Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// 404 handler
/*app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});
*/
const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Testing database connection...');

    // Test database connection
    await testConnection();

    console.log('🔄 Syncing database...');
    // Sync database (set force: true only in development to reset tables)
    await syncDatabase();

    console.log('🔄 Creating default admin user...');
    // Create default admin user if doesn't exist

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🚀 API available at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Create default admin user


// Start the server
startServer();