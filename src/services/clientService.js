// src/services/clientService.js
const { Client, ClientUser, ClientProject, UserPhoto, ClientRole } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const StaffStatisticsService = require('./staff/StaffStatisticsService');

class ClientService {
  /**
   * Get clients summary with calculated counts only
   */
  async getAllClientsSummary(options = {}) {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = null
    } = options;

    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { client_name: { [Op.iLike]: `%${search}%` } },
        { client_number: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }

    try {
      const totalCount = await Client.count({ where: whereClause });

      const clients = await Client.findAll({
        where: whereClause,
        attributes: [
          'client_id',
          'client_name',
          ['start_date', 'registered_date'],
          [
            literal(`(
              SELECT COUNT(*)::integer 
              FROM client_users 
              WHERE client_users.client_id = clients.client_id
            )`),
            'total_staff_count'
          ],
          [
            literal(`(
              SELECT COUNT(*)::integer 
              FROM client_projects 
              WHERE client_projects.client_id = clients.client_id
            )`),
            'total_projects_count'
          ]
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['start_date', 'DESC']],
        raw: true
      });

      const clientsSummary = clients.map(client => ({
        client_id: client.client_id,
        client_name: client.client_name,
        registered_date: client.registered_date,
        total_staff_count: client.total_staff_count || 0,
        total_projects_count: client.total_projects_count || 0
      }));

      return {
        clients: clientsSummary,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(totalCount / limit),
          has_next: page * limit < totalCount,
          has_prev: page > 1
        }
      };

    } catch (error) {
      throw new Error(`Failed to fetch clients summary: ${error.message}`);
    }
  }

  /**
   * Get single client summary by ID
   */
  async getClientSummaryById(clientId) {
    try {
      const client = await Client.findByPk(clientId, {
        attributes: [
          'client_id',
          'client_name',
          ['start_date', 'registered_date'],
          [
            literal(`(
              SELECT COUNT(*)::integer 
              FROM client_users 
              WHERE client_users.client_id = clients.client_id
            )`),
            'total_staff_count'
          ],
          [
            literal(`(
              SELECT COUNT(*)::integer 
              FROM client_projects 
              WHERE client_projects.client_id = clients.client_id
            )`),
            'total_projects_count'
          ]
        ],
        raw: true
      });

      if (!client) {
        return null;
      }

      return {
        client_id: client.client_id,
        client_name: client.client_name,
        registered_date: client.registered_date,
        total_staff_count: client.total_staff_count || 0,
        total_projects_count: client.total_projects_count || 0
      };

    } catch (error) {
      throw new Error(`Failed to fetch client summary: ${error.message}`);
    }
  }

  /**
   * ENHANCED: Get comprehensive statistics for a specific client with OT and face registration combinations
   */
  async getClientStatistics(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    try {
      // Get client information first
      const clientInfo = await StaffStatisticsService.getClientInfo(clientId);
      
      // Get comprehensive OT and face registration statistics
      const statistics = await StaffStatisticsService.getOtAndFaceStatistics(clientId);

      // Combine client info with statistics
      return {
        ...clientInfo,
        ...statistics
      };

    } catch (error) {
      if (error.message.includes('Client not found')) {
        throw error;
      }
      throw new Error(`Failed to fetch client statistics: ${error.message}`);
    }
  }

  /**
   * NEW: Get detailed client statistics with additional breakdowns
   */
  async getDetailedClientStatistics(clientId) {
    try {
      const basicStats = await this.getClientStatistics(clientId);
      
      // Add additional detailed breakdowns
      const detailedBreakdowns = await this.getAdditionalStatisticsBreakdowns(clientId);
      
      return {
        ...basicStats,
        detailed_breakdowns: detailedBreakdowns
      };
    } catch (error) {
      throw new Error(`Failed to fetch detailed client statistics: ${error.message}`);
    }
  }

  /**
   * Get additional statistics breakdowns (can be extended for future requirements)
   * @param {number} clientId - Client ID
   * @returns {Object} Additional breakdowns
   */
  async getAdditionalStatisticsBreakdowns(clientId) {
    try {
      // Placeholder for additional breakdowns like:
      // - Department wise breakdown
      // - Salary range breakdown
      // - Experience level breakdown
      // These can be implemented as needed
      
      return {
        department_breakdown: [],
        salary_range_breakdown: [],
        experience_level_breakdown: [],
        note: "Additional breakdowns can be implemented based on requirements"
      };
    } catch (error) {
      throw new Error(`Failed to fetch additional breakdowns: ${error.message}`);
    }
  }
}

module.exports = new ClientService();
