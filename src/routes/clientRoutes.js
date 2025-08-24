// src/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients summary (lightweight)
 * @access  Public (internal use)
 * @query   page, limit, search, status
 * @returns JSON with client_id, client_name, registered_date, total_staff_count, total_projects_count
 */
router.get('/', clientController.getAllClientsSummary);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client summary by ID (lightweight)
 * @access  Public (internal use)
 * @param   id - Client ID
 * @returns JSON with client summary
 */
router.get('/:id', clientController.getClientSummaryById);

module.exports = router;
