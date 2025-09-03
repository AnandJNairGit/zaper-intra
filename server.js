// server.js
require('dotenv').config();

const { app, testDBConnection } = require('./src/app');
const { port, host } = require('./src/config/app');
const logger = require('./src/utils/logger');
const { closeConnections } = require('./src/models');

// Test database connection
const startServer = async () => {
  try {
    await testDBConnection();
    
    // Start server
    app.listen(port, host, () => {
      logger.info(`Server running on http://${host}:${port}`);
      console.log(`🚀 Server running on http://${host}:${port}`);
      console.log(`📚 API Documentation: http://${host}:${port}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  try {
    await closeConnections();
    logger.info('All connections closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();
