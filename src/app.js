// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { apiPrefix } = require('./config/app');
const logger = require('./utils/logger');
const db = require('./models');

const app = express();

// Security and performance middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Request logging middleware
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use(apiPrefix || '/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Zaper Internal API',
    version: '1.0.0',
    status: 'running',
    documentation: `${req.protocol}://${req.get('host')}${apiPrefix || '/api/v1'}`
  });
});

// 404 handler
app.use('*notFound', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// Database connection test
const testDBConnection = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};

module.exports = { app, testDBConnection };
