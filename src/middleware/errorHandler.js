// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    return errorResponse(res, 'Validation error', 400, errors);
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    const message = process.env.NODE_ENV === 'production' 
      ? 'Database error occurred' 
      : err.message;
    return errorResponse(res, message, 500);
  }

  // Sequelize connection error
  if (err.name === 'SequelizeConnectionError') {
    return errorResponse(res, 'Database connection error', 503);
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
