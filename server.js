// server.js
require('dotenv').config();
const { app, testDBConnection } = require('./src/app'); // ✅ Destructure the import
const { port, host } = require('./src/config/app');
const logger = require('./src/utils/logger');

// Test database connection
testDBConnection();

// Start server
app.listen(port, host, () => {
  logger.info(`Server running on http://${host}:${port}`);
  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/v1`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
