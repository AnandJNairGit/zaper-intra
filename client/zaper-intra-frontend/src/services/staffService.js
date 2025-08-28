// src/services/staffService.js
import httpClient from '../utils/httpClient';

export class StaffService {
  /**
   * Get staff members for a specific client with pagination and filters
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
   * Get available search fields for staff search
   */
  async getSearchFields() {
    try {
      const response = await httpClient.get('/staffs/search-fields');
      return response;
    } catch (error) {
      console.error('Error fetching search fields:', error);
      throw new Error(`Failed to fetch search fields: ${error.message}`);
    }
  }

  /**
   * Get specific staff member by ID
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
