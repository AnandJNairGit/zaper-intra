// src/utils/response.js

/**
 * Standard success response format
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} JSON response
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    status: 'success',
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standard error response format
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Additional error details
 * @returns {Object} JSON response
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
