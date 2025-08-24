// src/services/clientService.js
const { Client, ClientUser, ClientProject, UserPhoto, ClientRole } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

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
   * Get comprehensive statistics for a specific client
   */
  async getClientStatistics(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    try {
      const clientExists = await Client.findByPk(clientId, {
        attributes: ['client_id', 'client_name']
      });

      if (!clientExists) {
        throw new Error('Client not found');
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [statisticsResult] = await Client.sequelize.query(`
        WITH client_stats AS (
          SELECT 
            c.client_id,
            c.client_name,
            COUNT(DISTINCT cp.project_id) AS total_projects,
            COUNT(DISTINCT cu.staff_id) AS total_staff,
            COUNT(DISTINCT CASE WHEN up.photo_id IS NOT NULL THEN cu.staff_id END) AS staff_with_registered_face,
            COUNT(DISTINCT CASE WHEN up.photo_id IS NULL THEN cu.staff_id END) AS staff_without_registered_face,
            COUNT(DISTINCT CASE WHEN cr.use_overtime = true AND up.photo_id IS NOT NULL THEN cu.staff_id END) AS overtime_enabled_staff_with_face,
            COUNT(DISTINCT CASE WHEN cr.use_overtime = true AND up.photo_id IS NULL THEN cu.staff_id END) AS overtime_enabled_staff_without_face,
            COUNT(DISTINCT CASE WHEN cu.joining_date >= :thirtyDaysAgo THEN cu.staff_id END) AS staff_onboarded_last_30_days,
            COUNT(DISTINCT CASE WHEN cu.current_active = true THEN cu.staff_id END) AS active_staff,
            COUNT(DISTINCT CASE WHEN (cu.current_active IS NULL OR cu.current_active = false) THEN cu.staff_id END) AS inactive_staff,
            COUNT(DISTINCT CASE WHEN cp.start_date >= :thirtyDaysAgo THEN cp.project_id END) AS projects_onboarded_last_30_days,
            COUNT(DISTINCT CASE WHEN cp.end_date >= :thirtyDaysAgo AND cp.end_date <= CURRENT_DATE THEN cp.project_id END) AS projects_ended_last_30_days
          FROM clients c
          LEFT JOIN client_users cu ON cu.client_id = c.client_id
          LEFT JOIN client_projects cp ON cp.client_id = c.client_id
          LEFT JOIN client_roles cr ON cr.role_id = cu.role_id
          LEFT JOIN user_photos up ON up.user_id = cu.user_id
          WHERE c.client_id = :clientId
          GROUP BY c.client_id, c.client_name
        )
        SELECT * FROM client_stats;
      `, {
        replacements: { 
          clientId: parseInt(clientId), 
          thirtyDaysAgo: thirtyDaysAgo.toISOString().split('T')[0]
        },
        type: Client.sequelize.QueryTypes.SELECT
      });

      if (!statisticsResult) {
        return {
          client_id: parseInt(clientId),
          client_name: clientExists.client_name,
          total_projects: 0,
          total_staff: 0,
          staff_with_registered_face: 0,
          staff_without_registered_face: 0,
          overtime_enabled_staff_with_face: 0,
          overtime_enabled_staff_without_face: 0,
          staff_onboarded_last_30_days: 0,
          active_staff: 0,
          inactive_staff: 0,
          projects_onboarded_last_30_days: 0,
          projects_ended_last_30_days: 0
        };
      }

      return {
        client_id: parseInt(statisticsResult.client_id),
        client_name: statisticsResult.client_name,
        total_projects: parseInt(statisticsResult.total_projects) || 0,
        total_staff: parseInt(statisticsResult.total_staff) || 0,
        staff_with_registered_face: parseInt(statisticsResult.staff_with_registered_face) || 0,
        staff_without_registered_face: parseInt(statisticsResult.staff_without_registered_face) || 0,
        overtime_enabled_staff_with_face: parseInt(statisticsResult.overtime_enabled_staff_with_face) || 0,
        overtime_enabled_staff_without_face: parseInt(statisticsResult.overtime_enabled_staff_without_face) || 0,
        staff_onboarded_last_30_days: parseInt(statisticsResult.staff_onboarded_last_30_days) || 0,
        active_staff: parseInt(statisticsResult.active_staff) || 0,
        inactive_staff: parseInt(statisticsResult.inactive_staff) || 0,
        projects_onboarded_last_30_days: parseInt(statisticsResult.projects_onboarded_last_30_days) || 0,
        projects_ended_last_30_days: parseInt(statisticsResult.projects_ended_last_30_days) || 0,
        staff_face_registration_percentage: parseInt(statisticsResult.total_staff) > 0 
          ? Math.round((parseInt(statisticsResult.staff_with_registered_face) / parseInt(statisticsResult.total_staff)) * 100)
          : 0,
        staff_activity_percentage: parseInt(statisticsResult.total_staff) > 0
          ? Math.round((parseInt(statisticsResult.active_staff) / parseInt(statisticsResult.total_staff)) * 100)
          : 0
      };

    } catch (error) {
      throw new Error(`Failed to fetch client statistics: ${error.message}`);
    }
  }
}

module.exports = new ClientService();
