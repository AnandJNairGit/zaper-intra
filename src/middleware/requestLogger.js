// src/middleware/requestLogger.js
const morgan = require('morgan');
const logger = require('../utils/logger');

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom format for logging
const logFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :response-time ms - :res[content-length]';

const requestLogger = morgan(logFormat, {
  stream: {
    write: (message) => {
      // Remove trailing newline
      const cleanMessage = message.trim();
      logger.info(`HTTP: ${cleanMessage}`);
    }
  },
  skip: (req, res) => {
    // Skip logging for health check in production
    return process.env.NODE_ENV === 'production' && req.path === '/health';
  }
});

module.exports = requestLogger;
