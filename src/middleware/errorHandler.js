// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * Global error handling middleware with enhanced logging
 */
const errorHandler = (err, req, res, next) => {
  // Enhanced error logging with context
  logger.error('Unhandled error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Sequelize specific errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    return errorResponse(res, 'Validation error', 400, errors);
  }

  if (err.name === 'SequelizeDatabaseError') {
    const message = process.env.NODE_ENV === 'production' 
      ? 'Database operation failed' 
      : err.message;
    return errorResponse(res, message, 500);
  }

  if (err.name === 'SequelizeConnectionError') {
    return errorResponse(res, 'Database connection error', 503);
  }

  // Custom application errors
  if (err.message.includes('Client not found')) {
    return errorResponse(res, 'Client not found', 404);
  }

  if (err.message.includes('Invalid client ID')) {
    return errorResponse(res, 'Invalid client ID provided', 400);
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
