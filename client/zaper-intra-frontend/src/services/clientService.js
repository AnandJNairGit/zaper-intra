// src/services/clientService.js
import httpClient from '../utils/httpClient';

export class ClientService {
  /**
   * Get all clients with pagination and filters
   */
  async getClients(params = {}) {
    try {
      const response = await httpClient.get('/clients', params);
      return response;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  /**
   * Get specific client by ID
   */
  async getClientById(clientId) {
    try {
      const response = await httpClient.get(`/clients/${clientId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching client ${clientId}:`, error);
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  /**
   * Get client statistics
   */
  async getClientStatistics(clientId) {
    try {
      const response = await httpClient.get(`/clients/${clientId}/statistics`);
      return response;
    } catch (error) {
      console.error(`Error fetching client ${clientId} statistics:`, error);
      throw new Error(`Failed to fetch client statistics: ${error.message}`);
    }
  }

  /**
   * Get detailed client statistics
   */
  async getClientDetailedStatistics(clientId) {
    try {
      const response = await httpClient.get(`/clients/${clientId}/statistics/detailed`);
      return response;
    } catch (error) {
      console.error(`Error fetching client ${clientId} detailed statistics:`, error);
      throw new Error(`Failed to fetch detailed statistics: ${error.message}`);
    }
  }
}

export const clientService = new ClientService();
export default clientService;
