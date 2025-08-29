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
 * NEW: @route   GET /api/v1/staffs/salary-filter-options
 * @desc    Get available salary filter options and supported currencies
 * @access  Public (internal use)
 * @returns Available salary fields, currencies, and usage examples
 */
router.get('/salary-filter-options', staffController.getSalaryFilterOptions);

/**
 * @route   GET /api/v1/staffs/client/:clientId
 * @desc    Get all staff members for a specific client with comprehensive filtering
 * @access  Public (internal use)
 * @param   clientId - Client ID
 * @query   Basic: page, limit, search, searchField, searchType, status, orderBy, orderDirection
 * @query   Combinational: otFilter, faceFilter, combinedFilter
 * @query   Salary: salaryField, minSalary, maxSalary, currency
 * @example GET /api/v1/staffs/client/1?salaryField=basic_salary&minSalary=50000&maxSalary=100000
 * @example GET /api/v1/staffs/client/1?combinedFilter=ot_with_face&salaryField=ctc&minSalary=80000
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
