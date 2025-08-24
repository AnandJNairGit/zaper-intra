// src/services/staffService.js
const { 
  ClientUser, 
  User, 
  Client, 
  ClientRole, 
  UserPhoto, 
  UserJobProfile, 
  UserSalary,
  UserNotificationToken,
  ClientJobProfile
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class StaffService {
  /**
   * Get comprehensive staff details for a particular client with pagination
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Paginated staff details with comprehensive information
   */
  async getStaffDetailsByClient(clientId, options = {}) {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = null,
      orderBy = 'joining_date',
      orderDirection = 'DESC'
    } = options;

    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    const offset = (page - 1) * limit;

    try {
      // Verify client exists first
      const client = await Client.findByPk(clientId, {
        attributes: ['client_id', 'client_name']
      });

      if (!client) {
        throw new Error('Client not found');
      }

      // Build where clause for filtering
      const whereClause = { client_id: clientId };

      // Add search functionality
      const includeWhere = {};
      if (search) {
        includeWhere[Op.or] = [
          { user_name: { [Op.iLike]: `%${search}%` } },
          { display_name: { [Op.iLike]: `%${search}%` } },
          { phone_number: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Add status filter
      if (status !== null) {
        whereClause.current_active = status === 'active';
      }

      // Execute optimized query with all necessary joins
      const { count, rows } = await ClientUser.findAndCountAll({
        where: whereClause,
        attributes: [
          'staff_id',
          'client_id', 
          'user_id',
          'role_id',
          'joining_date',
          'current_active',
          'code',
          'vendor_id',
          'permissions',
          'project_permissions',
          'created_at'
        ],
        include: [
          {
            model: User,
            as: 'user',
            where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
            attributes: [
              'user_id',
              'user_name',
              'display_name',
              'phone_number',
              'gender',
              'religion',
              'skills_and_proficiency',
              'language_spoken',
              'education',
              'date_of_birth',
              'description',
              'emailid',
              'profile_image',
              'skill_type',
              'zaper_skills',
              'type'
            ]
          },
          {
            model: Client,
            as: 'client',
            attributes: ['client_id', 'client_name', 'region', 'currency']
          },
          {
            model: ClientRole,
            as: 'role',
            required: false,
            attributes: [
              'role_id',
              'role_name',
              'use_overtime',
              'ot_above_hour',
              'regular_ot',
              'holiday_pay_rate',
              'sick_leave_eligibility',
              'annual_leave_eligibility',
              'insurance_eligibility',
              'air_ticket_eligibility'
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[orderBy, orderDirection.toUpperCase()]],
        distinct: true
      });

      // Get additional data for each staff member in batch
      const userIds = rows.map(row => row.user_id);
      
      // Batch fetch user photos
      const userPhotos = await UserPhoto.findAll({
        where: { user_id: { [Op.in]: userIds } },
        attributes: ['user_id', 'photo_id', 'photo_type', 'saved_to_vector']
      });

      // Batch fetch job profiles
      const userJobProfiles = await UserJobProfile.findAll({
        where: { user_id: { [Op.in]: userIds } },
        attributes: [
          'user_id',
          'profile_id',
          'contract_type',
          'skill_type',
          'reporting_to',
          'reportees',
          'profileinfo'
        ],
        include: [
          {
            model: ClientJobProfile,
            as: 'jobProfile',
            attributes: ['job_profile_id', 'job_profile_name']
          }
        ]
      });

      // Batch fetch salary information
      const userSalaries = await UserSalary.findAll({
        where: { user_id: { [Op.in]: userIds } },
        attributes: [
          'user_id',
          'take_home',
          'basic_salary',
          'ctc',
          'currency',
          'use_overtime'
        ]
      });

      // Batch fetch notification tokens
      const notificationTokens = await UserNotificationToken.findAll({
        where: { user_id: { [Op.in]: userIds } },
        attributes: ['user_id', 'device_type', 'created_at']
      });

      // Create lookup maps for efficient data retrieval
      const photosMap = {};
      userPhotos.forEach(photo => {
        if (!photosMap[photo.user_id]) photosMap[photo.user_id] = [];
        photosMap[photo.user_id].push(photo);
      });

      const jobProfilesMap = {};
      userJobProfiles.forEach(profile => {
        jobProfilesMap[profile.user_id] = profile;
      });

      const salariesMap = {};
      userSalaries.forEach(salary => {
        salariesMap[salary.user_id] = salary;
      });

      const tokensMap = {};
      notificationTokens.forEach(token => {
        if (!tokensMap[token.user_id]) tokensMap[token.user_id] = [];
        tokensMap[token.user_id].push(token);
      });

      // Format comprehensive staff data
      const staffDetails = rows.map(staff => {
        const staffData = staff.get({ plain: true });
        const user = staffData.user || {};
        const role = staffData.role || {};
        const clientInfo = staffData.client || {};
        const photos = photosMap[user.user_id] || [];
        const jobProfile = jobProfilesMap[user.user_id] || {};
        const salary = salariesMap[user.user_id] || {};
        const tokens = tokensMap[user.user_id] || [];

        return {
          // Basic Information
          staff_id: staffData.staff_id,
          name: user.display_name || user.user_name || null,
          username: user.user_name || null,
          code: staffData.code || null,
          
          // Client Information
          client_id: clientInfo.client_id || null,
          client_name: clientInfo.client_name || null,
          client_region: clientInfo.region || null,
          client_currency: clientInfo.currency || null,
          
          // Employment Details
          status: staffData.current_active ? 'active' : 'inactive',
          onboard_date: staffData.joining_date || null,
          days_since_onboarding: staffData.joining_date 
            ? Math.floor((new Date() - new Date(staffData.joining_date)) / (1000 * 60 * 60 * 24))
            : null,
          
          // Role and Designation
          role_id: role.role_id || null,
          designation: role.role_name || null,
          job_profile_name: jobProfile.jobProfile?.job_profile_name || null,
          
          // Overtime Information
          ot_applicable: role.use_overtime || salary.use_overtime || false,
          ot_above_hour: role.ot_above_hour || null,
          regular_ot_rate: role.regular_ot || null,
          holiday_pay_rate: role.holiday_pay_rate || null,
          
          // Personal Information
          phone_number: user.phone_number || null,
          email: user.emailid || null,
          gender: user.gender || null,
          date_of_birth: user.date_of_birth || null,
          age: user.date_of_birth 
            ? Math.floor((new Date() - new Date(user.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
            : null,
          religion: user.religion || null,
          
          // Professional Information
          education: user.education || null,
          skills_and_proficiency: user.skills_and_proficiency || null,
          language_spoken: user.language_spoken || null,
          skill_type: user.skill_type || jobProfile.skill_type || null,
          zaper_skills: user.zaper_skills || null,
          user_type: user.type || null,
          
          // Job Profile Details
          contract_type: jobProfile.contract_type || null,
          reporting_to: jobProfile.reporting_to || null,
          reportees: jobProfile.reportees || null,
          profile_info: jobProfile.profileinfo || null,
          
          // Face Registration
          is_face_registered: photos.length > 0,
          total_photos: photos.length,
          face_photos_count: photos.filter(p => p.photo_type === 'face').length,
          vector_saved_photos: photos.filter(p => p.saved_to_vector).length,
          
          // Benefits and Eligibility
          sick_leave_eligibility: role.sick_leave_eligibility || false,
          annual_leave_eligibility: role.annual_leave_eligibility || false,
          insurance_eligibility: role.insurance_eligibility || false,
          air_ticket_eligibility: role.air_ticket_eligibility || false,
          
          // Salary Information
          basic_salary: salary.basic_salary || null,
          take_home_salary: salary.take_home || null,
          ctc: salary.ctc || null,
          salary_currency: salary.currency || null,
          
          // Additional Information
          accommodation: user.description || null,
          profile_image: user.profile_image || null,
          vendor_id: staffData.vendor_id || null,
          permissions: staffData.permissions || {},
          project_permissions: staffData.project_permissions || [],
          
          // Device Information
          registered_devices: tokens.length,
          device_types: [...new Set(tokens.map(t => t.device_type))],
          last_device_registration: tokens.length > 0 
            ? Math.max(...tokens.map(t => new Date(t.created_at).getTime()))
            : null,
          
          // Metadata
          record_created_at: staffData.created_at || null
        };
      });

      return {
        staffs: staffDetails,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(count / limit),
          has_next: page * limit < count,
          has_prev: page > 1
        },
        summary: {
          total_staff: count,
          active_staff: staffDetails.filter(s => s.status === 'active').length,
          inactive_staff: staffDetails.filter(s => s.status === 'inactive').length,
          face_registered: staffDetails.filter(s => s.is_face_registered).length,
          ot_applicable_count: staffDetails.filter(s => s.ot_applicable).length,
          client_info: {
            client_id: client.client_id,
            client_name: client.client_name
          }
        }
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
    if (!staffId || isNaN(staffId)) {
      throw new Error('Invalid staff ID provided');
    }

    try {
      const staff = await ClientUser.findByPk(staffId, {
        include: [
          { model: User, as: 'user' },
          { model: Client, as: 'client' },
          { model: ClientRole, as: 'role' }
        ]
      });

      if (!staff) {
        throw new Error('Staff member not found');
      }

      // Get additional details for this specific staff member
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
}

module.exports = new StaffService();
