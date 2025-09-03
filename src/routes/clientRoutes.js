// src/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');
const staffController = require('../controllers/staffController');

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
 * @route   GET /api/v1/clients/:id/statistics
 * @desc    Get comprehensive client statistics with OT, face registration combinations, and device counts
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns Enhanced statistics including Android and iOS device counts
 */
router.get('/:id/statistics', clientController.getClientStatistics);

/**
 * @route   GET /api/v1/clients/:id/statistics/detailed
 * @desc    Get detailed client statistics with additional breakdowns
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns Detailed statistics with comprehensive breakdowns
 */
router.get('/:id/statistics/detailed', clientController.getDetailedClientStatistics);

/**
 * @route   GET /api/v1/clients/:id/statistics/devices
 * @desc    Get detailed device statistics breakdown for a client
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns Detailed device type breakdown with registration dates
 */
router.get('/:id/statistics/devices', clientController.getClientDeviceStatistics);

/**
 * NEW: @route   GET /api/v1/client/:clientId/project-based-filter-options
 * @desc    Get list of projects (id and name) for a specific client - used for filter options
 * @access  Public (internal use)
 * @param   clientId - Client ID
 * @returns List of projects with id and name for filter dropdown
 */
router.get('/:clientId/project-based-filter-options', staffController.getProjectBasedFilterOptions);

module.exports = router;
