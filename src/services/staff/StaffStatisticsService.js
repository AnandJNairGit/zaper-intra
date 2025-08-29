// src/services/staff/StaffStatisticsService.js
const { Client } = require('../../models');

class StaffStatisticsService {
  /**
   * Get comprehensive OT, face registration, and device statistics for a client
   * @param {number} clientId - Client ID
   * @returns {Object} Statistics with all OT, face registration combinations, and device counts
   */
  static async getOtAndFaceStatistics(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    try {
      // Enhanced SQL query with device counts
      const query = `
        SELECT
          COUNT(DISTINCT cu.staff_id) AS total_staff,
          COUNT(DISTINCT CASE WHEN cu.current_active = true THEN cu.staff_id END) AS active_staff,
          COUNT(DISTINCT CASE WHEN cu.current_active = false OR cu.current_active IS NULL THEN cu.staff_id END) AS inactive_staff,
          
          -- Face registration counts
          COUNT(DISTINCT CASE WHEN up.photo_id IS NOT NULL THEN cu.staff_id END) AS staff_with_face,
          COUNT(DISTINCT CASE WHEN up.photo_id IS NULL THEN cu.staff_id END) AS staff_without_face,
          
          -- OT and Face combination counts
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
          
          -- Total OT categories
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
          
          -- NEW: Device counts
          COUNT(DISTINCT CASE 
            WHEN unt.device_type = 'android' 
            THEN unt.token_id 
          END) AS android_devices,
          
          COUNT(DISTINCT CASE 
            WHEN unt.device_type = 'ios' 
            THEN unt.token_id 
          END) AS ios_devices,
          
          COUNT(DISTINCT CASE 
            WHEN unt.device_type IN ('android', 'ios') 
            THEN unt.token_id 
          END) AS total_mobile_devices,
          
          COUNT(DISTINCT CASE 
            WHEN unt.device_type NOT IN ('android', 'ios') AND unt.device_type IS NOT NULL 
            THEN unt.token_id 
          END) AS other_devices,
          
          -- Staff with devices
          COUNT(DISTINCT CASE 
            WHEN unt.token_id IS NOT NULL 
            THEN cu.staff_id 
          END) AS staff_with_devices,
          
          COUNT(DISTINCT CASE 
            WHEN unt.token_id IS NULL 
            THEN cu.staff_id 
          END) AS staff_without_devices,
          
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
        LEFT JOIN user_notification_tokens unt ON unt.user_id = cu.user_id
        LEFT JOIN client_projects cp ON cp.client_id = cu.client_id
        WHERE cu.client_id = :clientId
      `;

      const [result] = await Client.sequelize.query(query, {
        replacements: { clientId: parseInt(clientId) },
        type: Client.sequelize.QueryTypes.SELECT
      });

      return this.formatStatisticsResult(result, clientId);

    } catch (error) {
      throw new Error(`Failed to fetch OT, face, and device statistics: ${error.message}`);
    }
  }

  /**
   * Format and enhance statistics result with calculated percentages and device breakdowns
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
      
      // OT and Face combination counts
      ot_with_face_registered: parseInt(rawResult.ot_with_face_registered) || 0,
      ot_without_face_registered: parseInt(rawResult.ot_without_face_registered) || 0,
      non_ot_with_face_registered: parseInt(rawResult.non_ot_with_face_registered) || 0,
      non_ot_without_face_registered: parseInt(rawResult.non_ot_without_face_registered) || 0,
      
      // Total OT categories
      all_ot_users: parseInt(rawResult.all_ot_users) || 0,
      all_non_ot_users: parseInt(rawResult.all_non_ot_users) || 0,
      
      // NEW: Device counts
      android_devices: parseInt(rawResult.android_devices) || 0,
      ios_devices: parseInt(rawResult.ios_devices) || 0,
      total_mobile_devices: parseInt(rawResult.total_mobile_devices) || 0,
      other_devices: parseInt(rawResult.other_devices) || 0,
      staff_with_devices: parseInt(rawResult.staff_with_devices) || 0,
      staff_without_devices: parseInt(rawResult.staff_without_devices) || 0,
      
      // Project counts
      total_projects: parseInt(rawResult.total_projects) || 0,
      staff_onboarded_last_30_days: parseInt(rawResult.staff_onboarded_last_30_days) || 0,
      projects_onboarded_last_30_days: parseInt(rawResult.projects_onboarded_last_30_days) || 0,
      projects_ended_last_30_days: parseInt(rawResult.projects_ended_last_30_days) || 0,
    };

    // Calculate percentages
    const totalStaff = stats.total_staff;
    const totalDevices = stats.android_devices + stats.ios_devices + stats.other_devices;

    if (totalStaff > 0) {
      stats.staff_face_registration_percentage = Math.round((stats.staff_with_face_registered / totalStaff) * 100);
      stats.staff_activity_percentage = Math.round((stats.active_staff / totalStaff) * 100);
      stats.ot_eligibility_percentage = Math.round((stats.all_ot_users / totalStaff) * 100);
      stats.ot_with_face_percentage = Math.round((stats.ot_with_face_registered / totalStaff) * 100);
      stats.non_ot_with_face_percentage = Math.round((stats.non_ot_with_face_registered / totalStaff) * 100);
      stats.device_adoption_percentage = Math.round((stats.staff_with_devices / totalStaff) * 100);
    } else {
      stats.staff_face_registration_percentage = 0;
      stats.staff_activity_percentage = 0;
      stats.ot_eligibility_percentage = 0;
      stats.ot_with_face_percentage = 0;
      stats.non_ot_with_face_percentage = 0;
      stats.device_adoption_percentage = 0;
    }

    // NEW: Device distribution percentages
    if (totalDevices > 0) {
      stats.android_device_percentage = Math.round((stats.android_devices / totalDevices) * 100);
      stats.ios_device_percentage = Math.round((stats.ios_devices / totalDevices) * 100);
      stats.other_device_percentage = Math.round((stats.other_devices / totalDevices) * 100);
    } else {
      stats.android_device_percentage = 0;
      stats.ios_device_percentage = 0;
      stats.other_device_percentage = 0;
    }

    // Enhanced breakdown summary with device information
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
      },
      // NEW: Device breakdown
      device_breakdown: {
        android_devices: stats.android_devices,
        ios_devices: stats.ios_devices,
        other_devices: stats.other_devices,
        total_devices: totalDevices,
        staff_with_devices: stats.staff_with_devices,
        staff_without_devices: stats.staff_without_devices,
        device_distribution: {
          android_percentage: stats.android_device_percentage,
          ios_percentage: stats.ios_device_percentage,
          other_percentage: stats.other_device_percentage
        }
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

  /**
   * NEW: Get detailed device statistics breakdown
   * @param {number} clientId - Client ID
   * @returns {Object} Detailed device statistics
   */
  static async getDetailedDeviceStatistics(clientId) {
    try {
      const query = `
        SELECT 
          unt.device_type,
          COUNT(DISTINCT unt.token_id) as device_count,
          COUNT(DISTINCT cu.staff_id) as staff_count,
          MAX(unt.created_at) as latest_registration,
          MIN(unt.created_at) as earliest_registration
        FROM client_users cu
        INNER JOIN user_notification_tokens unt ON unt.user_id = cu.user_id
        WHERE cu.client_id = :clientId AND unt.device_type IS NOT NULL
        GROUP BY unt.device_type
        ORDER BY device_count DESC
      `;

      const results = await Client.sequelize.query(query, {
        replacements: { clientId: parseInt(clientId) },
        type: Client.sequelize.QueryTypes.SELECT
      });

      return results.map(result => ({
        device_type: result.device_type,
        device_count: parseInt(result.device_count),
        staff_count: parseInt(result.staff_count),
        latest_registration: result.latest_registration,
        earliest_registration: result.earliest_registration
      }));

    } catch (error) {
      throw new Error(`Failed to fetch detailed device statistics: ${error.message}`);
    }
  }
}

module.exports = StaffStatisticsService;
