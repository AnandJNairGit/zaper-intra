// src/controllers/staffController.js
const staffService = require('../services/staff/StaffService');
const StaffValidator = require('../services/staff/StaffValidator');
const ProjectService = require('../services/ProjectService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class StaffController {
  /**
   * ENHANCED: Get all staff members for a specific client with comprehensive filtering including project-based filtering
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

      // NEW: Validate project ID if provided
      if (queryOptions.projectId) {
        const projectBelongsToClient = await ProjectService.verifyProjectBelongsToClient(
          parseInt(clientId), 
          parseInt(queryOptions.projectId)
        );
        
        if (!projectBelongsToClient) {
          return errorResponse(res, 'Project does not belong to the specified client.', 400);
        }
      }

      const result = await staffService.getStaffDetailsByClient(parseInt(clientId), queryOptions);
      
      logger.info(`Retrieved ${result.staffs.length} staff records for client ${clientId}`, {
        clientId: parseInt(clientId),
        page: result.pagination.page,
        total: result.pagination.total,
        searchField: queryOptions.searchField || 'all',
        searchTerm: queryOptions.search || null,
        otFilter: queryOptions.otFilter || 'all',
        faceFilter: queryOptions.faceFilter || 'all',
        combinedFilter: queryOptions.combinedFilter || null,
        // Salary filter logging
        salaryField: queryOptions.salaryField || null,
        minSalary: queryOptions.minSalary || null,
        maxSalary: queryOptions.maxSalary || null,
        currency: queryOptions.currency || null,
        // Device filter logging
        deviceFilter: queryOptions.deviceFilter || 'all',
        // Projects filter logging
        projectsFilter: queryOptions.projectsFilter || 'all',
        // NEW: Project-based filter logging
        projectId: queryOptions.projectId || null
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
        queryParams: req.query,
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
   * Get available search fields
   * GET /api/v1/staffs/search-fields
   */
  async getSearchFields(req, res) {
    try {
      const searchFields = StaffValidator.getSearchableFields();
      
      return successResponse(
        res,
        'Search fields retrieved successfully',
        {
          searchFields,
          searchTypes: ['like', 'exact', 'starts_with', 'ends_with']
        },
        200
      );
    } catch (error) {
      logger.error('Error in getSearchFields:', error);
      return errorResponse(res, 'Failed to retrieve search fields', 500);
    }
  }

  /**
   * Get available combinational filter options
   * GET /api/v1/staffs/filter-options
   */
  async getFilterOptions(req, res) {
    try {
      const filterOptions = StaffValidator.getCombinationalFilterOptions();
      
      return successResponse(
        res,
        'Filter options retrieved successfully',
        filterOptions,
        200
      );
    } catch (error) {
      logger.error('Error in getFilterOptions:', error);
      return errorResponse(res, 'Failed to retrieve filter options', 500);
    }
  }

  /**
   * Get available salary filter options
   * GET /api/v1/staffs/salary-filter-options
   */
  async getSalaryFilterOptions(req, res) {
    try {
      const salaryFilterOptions = StaffValidator.getSalaryFilterOptions();
      
      return successResponse(
        res,
        'Salary filter options retrieved successfully',
        salaryFilterOptions,
        200
      );
    } catch (error) {
      logger.error('Error in getSalaryFilterOptions:', error);
      return errorResponse(res, 'Failed to retrieve salary filter options', 500);
    }
  }

  /**
   * Get available device filter options
   * GET /api/v1/staffs/device-filter-options
   */
  async getDeviceFilterOptions(req, res) {
    try {
      const deviceFilterOptions = StaffValidator.getDeviceFilterOptions();
      
      return successResponse(
        res,
        'Device filter options retrieved successfully',
        deviceFilterOptions,
        200
      );
    } catch (error) {
      logger.error('Error in getDeviceFilterOptions:', error);
      return errorResponse(res, 'Failed to retrieve device filter options', 500);
    }
  }

  /**
   * Get available project count filter options
   * GET /api/v1/staffs/project-filter-options
   */
  async getProjectFilterOptions(req, res) {
    try {
      const projectFilterOptions = StaffValidator.getProjectFilterOptions();
      
      return successResponse(
        res,
        'Project filter options retrieved successfully',
        projectFilterOptions,
        200
      );
    } catch (error) {
      logger.error('Error in getProjectFilterOptions:', error);
      return errorResponse(res, 'Failed to retrieve project filter options', 500);
    }
  }

  /**
   * NEW: Get project-based filter options for a specific client
   * GET /api/v1/client/:clientId/project-based-filter-options
   */
  async getProjectBasedFilterOptions(req, res) {
    try {
      const { clientId } = req.params;

      if (!clientId || isNaN(clientId)) {
        return errorResponse(res, 'Invalid client ID. Must be a valid number.', 400);
      }

      const projects = await ProjectService.getProjectsForClient(parseInt(clientId));
      
      logger.info(`Retrieved ${projects.length} projects for client ${clientId} filter options`);
      
      return successResponse(
        res,
        'Project-based filter options retrieved successfully',
        projects,
        200
      );

    } catch (error) {
      logger.error(`Error in getProjectBasedFilterOptions for client ${req.params.clientId}:`, error);

      if (error.message.includes('Invalid client ID')) {
        return errorResponse(res, 'Invalid client ID provided', 400);
      }

      return errorResponse(
        res,
        'Failed to retrieve project-based filter options',
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
