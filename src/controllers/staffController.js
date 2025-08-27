// src/controllers/staffController.js
const staffService = require('../services/staff/StaffService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { STAFF_CONSTANTS } = require('../utils/constants');

class StaffController {
  /**
   * Get all staff members for a specific client
   * GET /api/v1/staffs/client/:clientId
   */
  async getStaffByClient(req, res) {
    try {
      const { clientId } = req.params;
      const queryOptions = req.query;

      // Basic validation
      if (!clientId || isNaN(clientId)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const result = await staffService.getStaffDetailsByClient(parseInt(clientId), queryOptions);
      
      logger.info(`Retrieved ${result.staffs.length} staff records for client ${clientId}`, {
        clientId: parseInt(clientId),
        page: result.pagination.page,
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

  /**
   * Get staff statistics for a client
   * GET /api/v1/staffs/client/:clientId/statistics
   */
  async getStaffStatistics(req, res) {
    try {
      const { clientId } = req.params;

      if (!clientId || isNaN(clientId)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const statistics = await staffService.getStaffStatistics(parseInt(clientId));
      
      return successResponse(
        res,
        'Staff statistics retrieved successfully',
        { statistics },
        200
      );

    } catch (error) {
      logger.error(`Error in getStaffStatistics for client ${req.params.clientId}:`, error);

      if (error.message.includes('Client not found')) {
        return errorResponse(res, 'Client not found', 404);
      }

      return errorResponse(
        res,
        'Failed to retrieve staff statistics',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }
}

module.exports = new StaffController();
