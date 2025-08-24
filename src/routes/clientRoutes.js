// src/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Debug: Check if controller methods exist
console.log('ClientController methods:', Object.getOwnPropertyNames(clientController));
console.log('getAllClientsSummary type:', typeof clientController.getAllClientsSummary);
console.log('getClientSummaryById type:', typeof clientController.getClientSummaryById);
console.log('getClientStatistics type:', typeof clientController.getClientStatistics);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients summary (lightweight)
 */
router.get('/', clientController.getAllClientsSummary);

/**
 * @route   GET /api/v1/clients/:id/statistics  
 * @desc    Get comprehensive statistics for a specific client
 * @param   id - Client ID
 */
router.get('/:id/statistics', clientController.getClientStatistics);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client summary by ID (lightweight)
 * @param   id - Client ID
 */
router.get('/:id', clientController.getClientSummaryById);

module.exports = router;
