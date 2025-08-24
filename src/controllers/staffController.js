// src/controllers/staffController.js
const staffService = require('../services/staffService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class StaffController {
  /**
   * Get all staff members for a specific client
   * GET /api/v1/staffs/client/:clientId
   */
  async getStaffByClient(req, res) {
    try {
      const { clientId } = req.params;
      const {
        page = 1,
        limit = 50,
        search = '',
        status = null,
        orderBy = 'joining_date',
        orderDirection = 'DESC'
      } = req.query;

      // Validate parameters
      if (!clientId || isNaN(clientId)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      if (page < 1 || limit < 1 || limit > 100) {
        return errorResponse(res, 'Invalid pagination. Page >= 1, limit between 1-100.', 400);
      }

      const validOrderFields = ['joining_date', 'name', 'status', 'code'];
      if (!validOrderFields.includes(orderBy)) {
        return errorResponse(res, `Invalid orderBy field. Must be one of: ${validOrderFields.join(', ')}`, 400);
      }

      const validDirections = ['ASC', 'DESC'];
      if (!validDirections.includes(orderDirection.toUpperCase())) {
        return errorResponse(res, 'Invalid orderDirection. Must be ASC or DESC.', 400);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search.trim(),
        status,
        orderBy,
        orderDirection
      };

      const result = await staffService.getStaffDetailsByClient(parseInt(clientId), options);
      
      logger.info(`Retrieved ${result.staffs.length} staff records for client ${clientId}`, {
        clientId: parseInt(clientId),
        page: options.page,
        total: result.pagination.total
      });
      
      return successResponse(
        res,
        'Staff details retrieved successfully',
        result,
        200
      );

    } catch (error) {
      logger.error(`Error in getStaffByClient for client ${req.params.clientId}:`, {
        error: error.message,
        clientId: req.params.clientId,
        stack: error.stack
      });

      // Handle specific error cases
      if (error.message.includes('Client not found')) {
        return errorResponse(res, 'Client not found', 404);
      }

      if (error.message.includes('Invalid client ID')) {
        return errorResponse(res, 'Invalid client ID provided', 400);
      }

      return errorResponse(
        res,
        'Failed to retrieve staff details',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }

  /**
   * Get single staff member details by staff ID
   * GET /api/v1/staffs/:staffId
   */
  async getStaffById(req, res) {
    try {
      const { staffId } = req.params;

      if (!staffId || isNaN(staffId)) {
        return errorResponse(res, 'Invalid staff ID. Must be a valid number.', 400);
      }

      const staff = await staffService.getStaffById(parseInt(staffId));
      
      if (!staff) {
        return errorResponse(res, 'Staff member not found', 404);
      }

      logger.info(`Retrieved staff details for staff ID: ${staffId}`);
      
      return successResponse(
        res,
        'Staff details retrieved successfully',
        { staff },
        200
      );

    } catch (error) {
      logger.error(`Error in getStaffById for staff ${req.params.staffId}:`, error);

      if (error.message.includes('Staff member not found')) {
        return errorResponse(res, 'Staff member not found', 404);
      }

      if (error.message.includes('Invalid staff ID')) {
        return errorResponse(res, 'Invalid staff ID provided', 400);
      }

      return errorResponse(
        res,
        'Failed to retrieve staff details',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }
}

module.exports = new StaffController();
