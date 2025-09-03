// src/routes/index.js
const express = require('express');
const clientRoutes = require('./clientRoutes');
const staffRoutes = require('./staffRoutes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/clients', clientRoutes);
router.use('/staffs', staffRoutes);

// NEW: Add client-specific routes (for project-based filter options)
router.use('/client', clientRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Zaper Internal API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/v1/health',
      clients: {
        list: 'GET /api/v1/clients',
        details: 'GET /api/v1/clients/:id',
        statistics: 'GET /api/v1/clients/:id/statistics',
        detailedStatistics: 'GET /api/v1/clients/:id/statistics/detailed',
        deviceStatistics: 'GET /api/v1/clients/:id/statistics/devices',
        // NEW: Project-based filter options
        projectFilterOptions: 'GET /api/v1/client/:clientId/project-based-filter-options'
      },
      staffs: {
        by_client: 'GET /api/v1/staffs/client/:clientId',
        by_staff_id: 'GET /api/v1/staffs/:staffId',
        search_fields: 'GET /api/v1/staffs/search-fields',
        filter_options: 'GET /api/v1/staffs/filter-options',
        salary_filter_options: 'GET /api/v1/staffs/salary-filter-options',
        device_filter_options: 'GET /api/v1/staffs/device-filter-options',
        project_filter_options: 'GET /api/v1/staffs/project-filter-options'
      }
    }
  });
});

module.exports = router;
