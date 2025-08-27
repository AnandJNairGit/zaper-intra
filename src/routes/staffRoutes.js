// src/routes/staffRoutes.js
const express = require('express');
const staffController = require('../controllers/staffController');

const router = express.Router();

/**
 * @route   GET /api/v1/staffs/client/:clientId
 * @desc    Get all staff members for a specific client with comprehensive details
 * @access  Public (internal use)
 * @param   clientId - Client ID
 * @query   page, limit, search, status, orderBy, orderDirection
 */
router.get('/client/:clientId', staffController.getStaffByClient);

/**
 * @route   GET /api/v1/staffs/client/:clientId/statistics
 * @desc    Get staff statistics for a specific client
 * @access  Public (internal use)
 * @param   clientId - Client ID
 */
router.get('/client/:clientId/statistics', staffController.getStaffStatistics);

/**
 * @route   GET /api/v1/staffs/:staffId
 * @desc    Get single staff member details by staff ID
 * @access  Public (internal use)
 * @param   staffId - Staff ID
 */
router.get('/:staffId', staffController.getStaffById);

module.exports = router;
