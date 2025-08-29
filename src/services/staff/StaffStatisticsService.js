// src/services/staff/StaffStatisticsService.js
const { Client } = require('../../models');

class StaffStatisticsService {
  /**
   * Get comprehensive OT and face registration statistics for a client
   * @param {number} clientId - Client ID
   * @returns {Object} Statistics with all OT and face combinations
   */
  static async getOtAndFaceStatistics(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    try {
      // Enhanced SQL query with all required combinations
      const query = `
        SELECT
          COUNT(DISTINCT cu.staff_id) AS total_staff,
          COUNT(DISTINCT CASE WHEN cu.current_active = true THEN cu.staff_id END) AS active_staff,
          COUNT(DISTINCT CASE WHEN cu.current_active = false OR cu.current_active IS NULL THEN cu.staff_id END) AS inactive_staff,
          
          -- Face registration counts
          COUNT(DISTINCT CASE WHEN up.photo_id IS NOT NULL THEN cu.staff_id END) AS staff_with_face,
          COUNT(DISTINCT CASE WHEN up.photo_id IS NULL THEN cu.staff_id END) AS staff_without_face,
          
          -- NEW: OT and Face combination counts
          COUNT(DISTINCT CASE 
            WHEN (cr.use_overtime = true OR us.use_overtime = true) AND up.photo_id IS NOT NULL 
            THEN cu.staff_id 
          END) AS ot_with_face_registered,
          
          COUNT(DISTINCT CASE 
            WHEN (cr.use_overtime = true OR us.use_overtime = true) AND up.photo_id IS NULL 
            THEN cu.staff_id 
          END) AS ot_without_face_registered,
          
          COUNT(DISTINCT CASE 
            WHEN (
              (cr.use_overtime IS NULL OR cr.use_overtime = false) AND 
              (us.use_overtime IS NULL OR us.use_overtime = false)
            ) AND up.photo_id IS NOT NULL 
            THEN cu.staff_id 
          END) AS non_ot_with_face_registered,
          
          COUNT(DISTINCT CASE 
            WHEN (
              (cr.use_overtime IS NULL OR cr.use_overtime = false) AND 
              (us.use_overtime IS NULL OR us.use_overtime = false)
            ) AND up.photo_id IS NULL 
            THEN cu.staff_id 
          END) AS non_ot_without_face_registered,
          
          -- NEW: Total OT categories
          COUNT(DISTINCT CASE 
            WHEN (cr.use_overtime = true OR us.use_overtime = true) 
            THEN cu.staff_id 
          END) AS all_ot_users,
          
          COUNT(DISTINCT CASE 
            WHEN (
              (cr.use_overtime IS NULL OR cr.use_overtime = false) AND 
              (us.use_overtime IS NULL OR us.use_overtime = false)
            ) 
            THEN cu.staff_id 
          END) AS all_non_ot_users,
          
          -- Additional useful counts
          COUNT(DISTINCT cp.project_id) AS total_projects,
          COUNT(DISTINCT CASE WHEN cu.joining_date >= CURRENT_DATE - INTERVAL '30 days' THEN cu.staff_id END) AS staff_onboarded_last_30_days,
          COUNT(DISTINCT CASE WHEN cp.start_date >= CURRENT_DATE - INTERVAL '30 days' THEN cp.project_id END) AS projects_onboarded_last_30_days,
          COUNT(DISTINCT CASE 
            WHEN cp.end_date >= CURRENT_DATE - INTERVAL '30 days' AND cp.end_date <= CURRENT_DATE 
            THEN cp.project_id 
          END) AS projects_ended_last_30_days
          
        FROM client_users cu
        LEFT JOIN client_roles cr ON cr.role_id = cu.role_id
        LEFT JOIN user_salary us ON us.user_id = cu.user_id
        LEFT JOIN user_photos up ON up.user_id = cu.user_id
        LEFT JOIN client_projects cp ON cp.client_id = cu.client_id
        WHERE cu.client_id = :clientId
      `;

      const [result] = await Client.sequelize.query(query, {
        replacements: { clientId: parseInt(clientId) },
        type: Client.sequelize.QueryTypes.SELECT
      });

      return this.formatStatisticsResult(result, clientId);

    } catch (error) {
      throw new Error(`Failed to fetch OT and face statistics: ${error.message}`);
    }
  }

  /**
   * Format and enhance statistics result with calculated percentages
   * @param {Object} rawResult - Raw query result
   * @param {number} clientId - Client ID
   * @returns {Object} Formatted statistics
   */
  static formatStatisticsResult(rawResult, clientId) {
    const stats = {
      client_id: parseInt(clientId),
      
      // Basic counts
      total_staff: parseInt(rawResult.total_staff) || 0,
      active_staff: parseInt(rawResult.active_staff) || 0,
      inactive_staff: parseInt(rawResult.inactive_staff) || 0,
      
      // Face registration counts
      staff_with_face_registered: parseInt(rawResult.staff_with_face) || 0,
      staff_without_face_registered: parseInt(rawResult.staff_without_face) || 0,
      
      // NEW: OT and Face combination counts
      ot_with_face_registered: parseInt(rawResult.ot_with_face_registered) || 0,
      ot_without_face_registered: parseInt(rawResult.ot_without_face_registered) || 0,
      non_ot_with_face_registered: parseInt(rawResult.non_ot_with_face_registered) || 0,
      non_ot_without_face_registered: parseInt(rawResult.non_ot_without_face_registered) || 0,
      
      // NEW: Total OT categories
      all_ot_users: parseInt(rawResult.all_ot_users) || 0,
      all_non_ot_users: parseInt(rawResult.all_non_ot_users) || 0,
      
      // Project counts
      total_projects: parseInt(rawResult.total_projects) || 0,
      staff_onboarded_last_30_days: parseInt(rawResult.staff_onboarded_last_30_days) || 0,
      projects_onboarded_last_30_days: parseInt(rawResult.projects_onboarded_last_30_days) || 0,
      projects_ended_last_30_days: parseInt(rawResult.projects_ended_last_30_days) || 0,
    };

    // Calculate percentages
    const totalStaff = stats.total_staff;
    if (totalStaff > 0) {
      stats.staff_face_registration_percentage = Math.round((stats.staff_with_face_registered / totalStaff) * 100);
      stats.staff_activity_percentage = Math.round((stats.active_staff / totalStaff) * 100);
      stats.ot_eligibility_percentage = Math.round((stats.all_ot_users / totalStaff) * 100);
      
      // NEW: Additional percentage calculations
      stats.ot_with_face_percentage = Math.round((stats.ot_with_face_registered / totalStaff) * 100);
      stats.non_ot_with_face_percentage = Math.round((stats.non_ot_with_face_registered / totalStaff) * 100);
    } else {
      stats.staff_face_registration_percentage = 0;
      stats.staff_activity_percentage = 0;
      stats.ot_eligibility_percentage = 0;
      stats.ot_with_face_percentage = 0;
      stats.non_ot_with_face_percentage = 0;
    }

    // NEW: Add breakdown summary
    stats.breakdown_summary = {
      ot_breakdown: {
        total: stats.all_ot_users,
        with_face: stats.ot_with_face_registered,
        without_face: stats.ot_without_face_registered
      },
      non_ot_breakdown: {
        total: stats.all_non_ot_users,
        with_face: stats.non_ot_with_face_registered,
        without_face: stats.non_ot_without_face_registered
      },
      face_registration_breakdown: {
        total_with_face: stats.staff_with_face_registered,
        total_without_face: stats.staff_without_face_registered,
        ot_with_face: stats.ot_with_face_registered,
        non_ot_with_face: stats.non_ot_with_face_registered
      }
    };

    return stats;
  }

  /**
   * Get client information
   * @param {number} clientId - Client ID
   * @returns {Object} Client information
   */
  static async getClientInfo(clientId) {
    try {
      const client = await Client.findByPk(clientId, {
        attributes: ['client_id', 'client_name']
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return {
        client_id: client.client_id,
        client_name: client.client_name
      };
    } catch (error) {
      throw new Error(`Failed to fetch client info: ${error.message}`);
    }
  }
}

module.exports = StaffStatisticsService;
