// src/routes/staffRoutes.js
const express = require('express');
const staffController = require('../controllers/staffController');

const router = express.Router();

/**
 * @route   GET /api/v1/staffs/search-fields
 * @desc    Get available search fields and search types
 * @access  Public (internal use)
 * @returns Available search fields and types
 */
router.get('/search-fields', staffController.getSearchFields);

/**
 * @route   GET /api/v1/staffs/client/:clientId
 * @desc    Get all staff members for a specific client with advanced search
 * @access  Public (internal use)
 * @param   clientId - Client ID
 * @query   page, limit, search, searchField, searchType, status, orderBy, orderDirection
 * @example GET /api/v1/staffs/client/1?search=john&searchField=name&searchType=like
 */
router.get('/client/:clientId', staffController.getStaffByClient);

/**
 * @route   GET /api/v1/staffs/:staffId
 * @desc    Get single staff member details by staff ID
 * @access  Public (internal use)
 * @param   staffId - Staff ID
 */
router.get('/:staffId', staffController.getStaffById);

module.exports = router;
