// src/services/staff/StaffService.js
const StaffValidator = require('./StaffValidator');
const StaffDataFetcher = require('./StaffDataFetcher');
const StaffDataTransformer = require('./StaffDataTransformer');
const PaginationHelper = require('../../utils/pagination');

class StaffService {
  /**
   * Get comprehensive staff details for a particular client with pagination
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Paginated staff details with comprehensive information
   */
  async getStaffDetailsByClient(clientId, options = {}) {
    try {
      // Validate inputs
      StaffValidator.validateClientId(clientId);
      const validatedOptions = StaffValidator.validateQueryOptions(options);

      // Verify client exists
      const client = await StaffDataFetcher.verifyClientExists(clientId);

      // Fetch main staff data
      const { count, rows } = await StaffDataFetcher.fetchStaffData(clientId, validatedOptions);

      // Extract user IDs for batch queries
      const userIds = rows.map(row => row.user_id);

      // Fetch related data in batches
      const relatedData = await StaffDataFetcher.fetchRelatedData(userIds);

      // Transform data to formatted response
      const staffDetails = StaffDataTransformer.transformStaffData(rows, relatedData);

      // Calculate pagination
      const pagination = PaginationHelper.calculatePagination(
        validatedOptions.page,
        validatedOptions.limit,
        count
      );

      // Build summary
      const summary = StaffDataTransformer.buildSummary(staffDetails, client, count);

      return {
        staffs: staffDetails,
        pagination,
        summary
      };

    } catch (error) {
      throw new Error(`Failed to fetch staff details: ${error.message}`);
    }
  }

  /**
   * Get single staff member details by staff ID
   * @param {number} staffId - Staff ID
   * @returns {Object} Single staff member details
   */
  async getStaffById(staffId) {
    try {
      // Validate staff ID
      StaffValidator.validateStaffId(staffId);

      // Fetch staff data
      const staff = await StaffDataFetcher.fetchStaffById(staffId);

      // Get comprehensive details using client method
      const additionalData = await this.getStaffDetailsByClient(
        staff.client_id, 
        { page: 1, limit: 1000 } // Get all to find this specific staff
      );

      const staffDetail = additionalData.staffs.find(s => s.staff_id === staffId);
      
      return staffDetail || null;

    } catch (error) {
      throw new Error(`Failed to fetch staff details: ${error.message}`);
    }
  }

  /**
   * Get staff statistics for a client
   * @param {number} clientId - Client ID
   * @returns {Object} Staff statistics
   */
  async getStaffStatistics(clientId) {
    try {
      StaffValidator.validateClientId(clientId);
      
      const data = await this.getStaffDetailsByClient(clientId, { page: 1, limit: 1000 });
      
      return {
        total_staff: data.summary.total_staff,
        active_staff: data.summary.active_staff,
        inactive_staff: data.summary.inactive_staff,
        face_registered_count: data.summary.face_registered,
        ot_applicable_count: data.summary.ot_applicable_count
      };
    } catch (error) {
      throw new Error(`Failed to fetch staff statistics: ${error.message}`);
    }
  }
}

module.exports = new StaffService();
