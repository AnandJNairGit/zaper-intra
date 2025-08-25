// src/services/staffService.js
import httpClient from '../utils/httpClient';

export class StaffService {
  /**
   * Get staff members for a specific client with pagination and filters
   * @param {number} clientId - Client ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @param {string} params.search - Search text
   * @param {string} params.status - Filter by status
   * @param {string} params.orderBy - Sort field
   * @param {string} params.orderDirection - Sort direction
   */
  async getStaffByClientId(clientId, params = {}) {
    try {
      const response = await httpClient.get(`/staffs/client/${clientId}`, params);
      return response;
    } catch (error) {
      console.error(`Error fetching staff for client ${clientId}:`, error);
      throw new Error(`Failed to fetch staff: ${error.message}`);
    }
  }

  /**
   * Get specific staff member by ID
   * @param {number} staffId - Staff ID
   */
  async getStaffById(staffId) {
    try {
      const response = await httpClient.get(`/staffs/${staffId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching staff ${staffId}:`, error);
      throw new Error(`Failed to fetch staff member: ${error.message}`);
    }
  }
}

export const staffService = new StaffService();
export default staffService;
