// src/services/clientService.js
const { Client, ClientUser, ClientProject } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class ClientService {
  /**
   * Get clients summary with calculated counts only
   * @param {Object} options - Query options
   * @returns {Object} Lightweight clients data with counts
   */
  async getAllClientsSummary(options = {}) {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = null
    } = options;

    const offset = (page - 1) * limit;
    
    // Build where clause for filtering
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
      // First, get total count for pagination
      const totalCount = await Client.count({ where: whereClause });

      // Get clients with calculated counts using raw SQL subqueries for better performance
      const clients = await Client.findAll({
        where: whereClause,
        attributes: [
          'client_id',
          'client_name',
          ['start_date', 'registered_date'],
          // Subquery to count staff for each client
          [
            literal(`(
              SELECT COUNT(*)::integer 
              FROM client_users 
              WHERE client_users.client_id = clients.client_id
            )`),
            'total_staff_count'
          ],
          // Subquery to count projects for each client
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
        raw: true // Return plain objects instead of Sequelize instances
      });

      // Transform the data to ensure clean response
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
        },
        summary: {
          total_clients: totalCount,
          clients_on_page: clientsSummary.length
        }
      };

    } catch (error) {
      throw new Error(`Failed to fetch clients summary: ${error.message}`);
    }
  }

  /**
   * Get single client summary by ID
   * @param {number} clientId - Client ID
   * @returns {Object} Single client summary
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
   * Alternative method using Sequelize associations with counting
   * More Sequelize-idiomatic but potentially slower for large datasets
   */
  async getAllClientsSummaryWithAssociations(options = {}) {
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
      const { count, rows } = await Client.findAndCountAll({
        where: whereClause,
        attributes: [
          'client_id',
          'client_name',
          ['start_date', 'registered_date']
        ],
        include: [
          {
            model: ClientUser,
            as: 'clientUsers',
            attributes: [[fn('COUNT', col('clientUsers.staff_id')), 'staff_count']]
          },
          {
            model: ClientProject,
            as: 'clientProjects',
            attributes: [[fn('COUNT', col('clientProjects.project_id')), 'project_count']]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['start_date', 'DESC']],
        group: ['clients.client_id'],
        subQuery: false
      });

      const clientsSummary = rows.map(client => {
        const clientData = client.get({ plain: true });
        return {
          client_id: clientData.client_id,
          client_name: clientData.client_name,
          registered_date: clientData.registered_date,
          total_staff_count: parseInt(clientData.clientUsers?.[0]?.staff_count || 0),
          total_projects_count: parseInt(clientData.clientProjects?.[0]?.project_count || 0)
        };
      });

      return {
        clients: clientsSummary,
        pagination: {
          total: Array.isArray(count) ? count.length : count,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil((Array.isArray(count) ? count.length : count) / limit)
        }
      };

    } catch (error) {
      throw new Error(`Failed to fetch clients summary: ${error.message}`);
    }
  }
}

module.exports = new ClientService();
