// src/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients with summary information
 * @access  Public (internal use)
 * @query   page, limit, search, status
 */
router.get('/', clientController.getAllClients);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get single client details by ID
 * @access  Public (internal use)
 * @param   id - Client ID
 */
router.get('/:id', clientController.getClientById);

/**
 * ENHANCED: @route   GET /api/v1/clients/:id/statistics
 * @desc    Get comprehensive client statistics with OT and face registration combinations
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns Enhanced statistics including all OT and face registration combinations
 */
router.get('/:id/statistics', clientController.getClientStatistics);

/**
 * NEW: @route   GET /api/v1/clients/:id/statistics/detailed
 * @desc    Get detailed client statistics with additional breakdowns
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns Detailed statistics with comprehensive breakdowns
 */
router.get('/:id/statistics/detailed', clientController.getDetailedClientStatistics);

module.exports = router;
