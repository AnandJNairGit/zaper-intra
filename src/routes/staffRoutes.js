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
 * @route   GET /api/v1/staffs/filter-options
 * @desc    Get available combinational filter options
 * @access  Public (internal use)
 * @returns Available OT, face, and combined filter options
 */
router.get('/filter-options', staffController.getFilterOptions);

/**
 * @route   GET /api/v1/staffs/salary-filter-options
 * @desc    Get available salary filter options and supported currencies
 * @access  Public (internal use)
 * @returns Available salary fields, currencies, and usage examples
 */
router.get('/salary-filter-options', staffController.getSalaryFilterOptions);

/**
 * @route   GET /api/v1/staffs/device-filter-options
 * @desc    Get available device filter options
 * @access  Public (internal use)
 * @returns Available device filter types and usage examples
 */
router.get('/device-filter-options', staffController.getDeviceFilterOptions);

/**
 * NEW: @route   GET /api/v1/staffs/project-filter-options
 * @desc    Get available project count filter options
 * @access  Public (internal use)
 * @returns Available project filter types and usage examples
 */
router.get('/project-filter-options', staffController.getProjectFilterOptions);

/**
 * @route   GET /api/v1/staffs/client/:clientId
 * @desc    Get all staff members for a specific client with comprehensive filtering
 * @access  Public (internal use)
 * @param   clientId - Client ID
 * @query   Basic: page, limit, search, searchField, searchType, status, orderBy, orderDirection
 * @query   Combinational: otFilter, faceFilter, combinedFilter
 * @query   Salary: salaryField, minSalary, maxSalary, currency
 * @query   Device: deviceFilter
 * @query   Projects: projectsFilter (NEW)
 * @example GET /api/v1/staffs/client/1?projectsFilter=single
 * @example GET /api/v1/staffs/client/1?projectsFilter=multi&otFilter=enabled
 * @example GET /api/v1/staffs/client/1?projectsFilter=none&deviceFilter=android
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
