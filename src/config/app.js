// src/config/app.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};
