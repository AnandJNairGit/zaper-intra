// src/routes/index.js
const express = require('express');
const clientRoutes = require('./clientRoutes');
const staffRoutes = require('./staffRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
router.use('/clients', clientRoutes);
router.use('/staffs', staffRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Zaper Internal API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/v1/health',
      clients: {
        list: 'GET /api/v1/clients',
        details: 'GET /api/v1/clients/:id',
        statistics: 'GET /api/v1/clients/:id/statistics'
      },
      staffs: {
        by_client: 'GET /api/v1/staffs/client/:clientId',
        by_staff_id: 'GET /api/v1/staffs/:staffId'
      }
    }
  });
});

module.exports = router;
