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
 * @returns JSON with comprehensive staff information including:
 *          - Basic info (name, code, status, onboard date)
 *          - Personal details (phone, email, gender, age, education)
 *          - Professional info (designation, salary, overtime)
 *          - Face registration status
 *          - Benefits eligibility
 *          - Device information
 */
router.get('/client/:clientId', staffController.getStaffByClient);

/**
 * @route   GET /api/v1/staffs/:staffId
 * @desc    Get single staff member details by staff ID
 * @access  Public (internal use)
 * @param   staffId - Staff ID
 * @returns JSON with comprehensive staff information
 */
router.get('/:staffId', staffController.getStaffById);

module.exports = router;
