// src/controllers/clientController.js
const clientService = require('../services/clientService');
const StaffStatisticsService = require('../services/staff/StaffStatisticsService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class ClientController {
  /**
   * Get all clients with summary information
   * GET /api/v1/clients
   */
  async getAllClients(req, res) {
    try {
      const queryOptions = req.query;
      const result = await clientService.getAllClientsSummary(queryOptions);
      
      logger.info(`Retrieved ${result.clients.length} clients`, {
        page: result.pagination.page,
        total: result.pagination.total
      });
      
      return successResponse(
        res,
        'Clients retrieved successfully',
        result,
        200
      );
    } catch (error) {
      logger.error('Error in getAllClients:', error);
      return errorResponse(res, 'Failed to retrieve clients', 500);
    }
  }

  /**
   * Get single client by ID
   * GET /api/v1/clients/:id
   */
  async getClientById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const client = await clientService.getClientSummaryById(parseInt(id));
      
      if (!client) {
        return errorResponse(res, 'Client not found', 404);
      }

      logger.info(`Retrieved client details for client ID: ${id}`);
      
      return successResponse(
        res,
        'Client details retrieved successfully',
        { client },
        200
      );
    } catch (error) {
      logger.error(`Error in getClientById for client ${req.params.id}:`, error);
      return errorResponse(res, 'Failed to retrieve client details', 500);
    }
  }

  /**
   * ENHANCED: Get client statistics with OT, face registration combinations, and device counts
   * GET /api/v1/clients/:id/statistics
   */
  async getClientStatistics(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const statistics = await clientService.getClientStatistics(parseInt(id));
      
      logger.info(`Retrieved enhanced statistics with device counts for client ID: ${id}`, {
        clientId: parseInt(id),
        totalStaff: statistics.total_staff,
        otWithFace: statistics.ot_with_face_registered,
        otWithoutFace: statistics.ot_without_face_registered,
        nonOtWithFace: statistics.non_ot_with_face_registered,
        nonOtWithoutFace: statistics.non_ot_without_face_registered,
        allOtUsers: statistics.all_ot_users,
        allNonOtUsers: statistics.all_non_ot_users,
        // NEW: Device counts logging
        androidDevices: statistics.android_devices,
        iosDevices: statistics.ios_devices,
        totalMobileDevices: statistics.total_mobile_devices,
        staffWithDevices: statistics.staff_with_devices
      });
      
      return successResponse(
        res,
        'Client statistics retrieved successfully',
        { statistics },
        200
      );
    } catch (error) {
      logger.error(`Error in getClientStatistics for client ${req.params.id}:`, error);

      if (error.message.includes('Client not found')) {
        return errorResponse(res, 'Client not found', 404);
      }

      if (error.message.includes('Invalid client ID')) {
        return errorResponse(res, 'Invalid client ID provided', 400);
      }

      return errorResponse(
        res,
        'Failed to retrieve client statistics',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }

  /**
   * Get detailed client statistics with additional breakdowns
   * GET /api/v1/clients/:id/statistics/detailed
   */
  async getDetailedClientStatistics(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const detailedStatistics = await clientService.getDetailedClientStatistics(parseInt(id));
      
      logger.info(`Retrieved detailed statistics for client ID: ${id}`, {
        clientId: parseInt(id),
        totalStaff: detailedStatistics.total_staff,
        breakdownCategories: Object.keys(detailedStatistics.breakdown_summary || {})
      });
      
      return successResponse(
        res,
        'Detailed client statistics retrieved successfully',
        { statistics: detailedStatistics },
        200
      );
    } catch (error) {
      logger.error(`Error in getDetailedClientStatistics for client ${req.params.id}:`, error);

      if (error.message.includes('Client not found')) {
        return errorResponse(res, 'Client not found', 404);
      }

      return errorResponse(
        res,
        'Failed to retrieve detailed client statistics',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }

  /**
   * NEW: Get detailed device statistics for a client
   * GET /api/v1/clients/:id/statistics/devices
   */
  async getClientDeviceStatistics(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const deviceStatistics = await StaffStatisticsService.getDetailedDeviceStatistics(parseInt(id));
      
      logger.info(`Retrieved device statistics for client ID: ${id}`, {
        clientId: parseInt(id),
        deviceTypes: deviceStatistics.map(d => d.device_type),
        totalDeviceTypes: deviceStatistics.length
      });
      
      return successResponse(
        res,
        'Client device statistics retrieved successfully',
        { device_statistics: deviceStatistics },
        200
      );
    } catch (error) {
      logger.error(`Error in getClientDeviceStatistics for client ${req.params.id}:`, error);

      if (error.message.includes('Client not found')) {
        return errorResponse(res, 'Client not found', 404);
      }

      return errorResponse(
        res,
        'Failed to retrieve client device statistics',
        500,
        process.env.NODE_ENV === 'development' ? error.message : null
      );
    }
  }
}

module.exports = new ClientController();
