// src/controllers/clientController.js
const clientService = require('../services/clientService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class ClientController {
  /**
   * Get all clients summary (lightweight)
   * GET /api/v1/clients
   * Query params: page, limit, search, status
   */
  async getAllClientsSummary(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        search = '',
        status = null
      } = req.query;

      // Validate query parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return errorResponse(res, 'Invalid pagination parameters. Page must be >= 1 and limit between 1-100', 400);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search.trim(),
        status
      };

      const result = await clientService.getAllClientsSummary(options);
      
      logger.info(`Retrieved ${result.clients.length} client summaries for page ${page}`);
      
      return successResponse(
        res,
        'Client summaries retrieved successfully',
        result,
        200
      );

    } catch (error) {
      logger.error('Error in getAllClientsSummary:', error);
      return errorResponse(
        res,
        'Failed to retrieve client summaries',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }

  /**
   * Get client summary by ID
   * GET /api/v1/clients/:id
   */
  async getClientSummaryById(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID parameter
      if (!id || isNaN(id)) {
        return errorResponse(res, 'Invalid client ID', 400);
      }

      const client = await clientService.getClientSummaryById(parseInt(id));
      
      if (!client) {
        return errorResponse(res, 'Client not found', 404);
      }

      logger.info(`Retrieved client summary for ID: ${id}`);
      
      return successResponse(
        res,
        'Client summary retrieved successfully',
        { client },
        200
      );

    } catch (error) {
      logger.error(`Error in getClientSummaryById for ID ${req.params.id}:`, error);
      return errorResponse(
        res,
        'Failed to retrieve client summary',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }
}

module.exports = new ClientController();
