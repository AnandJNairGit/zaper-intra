// src/services/staff/StaffDataFetcher.js
const { ClientUser, Client } = require('../../models');
const QueryHelpers = require('../../utils/queryHelpers');
const StaffQueryBuilder = require('./StaffQueryBuilder');

class StaffDataFetcher {
  /**
   * Verify client exists
   * @param {number} clientId - Client ID
   * @returns {Object} Client data
   * @throws {Error} If client not found
   */
  static async verifyClientExists(clientId) {
    const client = await Client.findByPk(clientId, {
      attributes: ['client_id', 'client_name']
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  }

  /**
   * Fetch main staff data with pagination and combinational filters
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Staff data with count
   */
  static async fetchStaffData(clientId, options) {
    const queryOptions = StaffQueryBuilder.buildStaffQuery(clientId, options);
    
    if (queryOptions.isRawQuery) {
      return await this.executeRawStaffQuery(queryOptions);
    } else {
      return await ClientUser.findAndCountAll(queryOptions);
    }
  }

  /**
   * Execute raw SQL query for complex combinational filters
   * @param {Object} queryOptions - Raw query options
   * @returns {Object} Query results with count
   */
  static async executeRawStaffQuery(queryOptions) {
    const { query, countQuery, replacements } = queryOptions;
    const sequelize = Client.sequelize;

    try {
      // Execute count query first
      const [countResult] = await sequelize.query(countQuery, {
        replacements,
        type: sequelize.QueryTypes.SELECT
      });

      // Execute main query
      const rows = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
        nest: true
      });

      // Transform and parse JSON fields safely
      const transformedRows = rows.map(row => {
        // Safe JSON parsing helper
        const safeJsonParse = (jsonString) => {
          try {
            if (!jsonString || jsonString === 'null' || jsonString === 'undefined') {
              return null;
            }
            return JSON.parse(jsonString);
          } catch (e) {
            return null;
          }
        };

        // Parse JSON fields from text
        const permissions = safeJsonParse(row.permissions_text) || {};
        const projectPermissions = safeJsonParse(row.project_permissions_text) || [];

        return {
          get: (options) => {
            if (options && options.plain) {
              return {
                ...row,
                permissions: permissions,
                project_permissions: projectPermissions
              };
            }
            return row;
          },
          toJSON: () => ({
            ...row,
            permissions: permissions,
            project_permissions: projectPermissions
          }),
          // Map fields correctly
          user_id: row.user_id,
          staff_id: row.staff_id,
          client_id: row.client_id,
          role_id: row.role_id,
          joining_date: row.joining_date,
          current_active: row.current_active,
          code: row.code,
          vendor_id: row.vendor_id,
          permissions: permissions,
          project_permissions: projectPermissions,
          created_at: row.created_at,
          user: row.user,
          client: row.client,
          role: row.role
        };
      });

      return {
        count: parseInt(countResult.count),
        rows: transformedRows
      };
    } catch (error) {
      throw new Error(`Raw query execution failed: ${error.message}`);
    }
  }

  /**
   * FIXED: Fetch related data in batches including project counts using raw SQL
   * @param {Array} userIds - Array of user IDs
   * @returns {Object} Related data maps including project counts
   */
  static async fetchRelatedData(userIds) {
    if (userIds.length === 0) {
      return {
        photosMap: {},
        jobProfilesMap: {},
        salariesMap: {},
        tokensMap: {},
        accommodationsMap: {},
        communicationDetailsMap: {},
        projectsMap: {}
      };
    }

    const batchQueries = StaffQueryBuilder.buildBatchQueries(userIds);

    // Execute all batch queries concurrently
    const [
      userPhotos, 
      userJobProfiles, 
      userSalaries, 
      notificationTokens,
      userCommunicationDetails,
      userProjects
    ] = await Promise.all([
      batchQueries.userPhotos.model.findAll(batchQueries.userPhotos.options),
      batchQueries.userJobProfiles.model.findAll(batchQueries.userJobProfiles.options),
      batchQueries.userSalaries.model.findAll(batchQueries.userSalaries.options),
      batchQueries.notificationTokens.model.findAll(batchQueries.notificationTokens.options),
      this.fetchUserCommunicationWithAccommodation(userIds),
      this.fetchUserProjectCounts(userIds) // FIXED: Use separate method
    ]);

    // Create lookup maps including accommodation data
    const accommodationsMap = {};
    const communicationDetailsMap = {};

    userCommunicationDetails.forEach(commDetail => {
      const userId = commDetail.user_id;
      
      // Map communication details
      if (!communicationDetailsMap[userId]) {
        communicationDetailsMap[userId] = [];
      }
      communicationDetailsMap[userId].push(commDetail);

      // Map accommodation details
      if (commDetail.accommodation) {
        if (!accommodationsMap[userId]) {
          accommodationsMap[userId] = [];
        }
        accommodationsMap[userId].push(commDetail.accommodation);
      }
    });

    return {
      photosMap: QueryHelpers.createLookupMap(userPhotos, 'user_id', true),
      jobProfilesMap: QueryHelpers.createLookupMap(userJobProfiles, 'user_id', false),
      salariesMap: QueryHelpers.createLookupMap(userSalaries, 'user_id', false),
      tokensMap: QueryHelpers.createLookupMap(notificationTokens, 'user_id', true),
      accommodationsMap,
      communicationDetailsMap,
      projectsMap: QueryHelpers.createLookupMap(userProjects, 'user_id', false)
    };
  }

  /**
   * FIXED: Fetch user project counts using raw SQL to avoid model dependency issues
   * @param {Array} userIds - Array of user IDs
   * @returns {Array} Project count data
   */
  static async fetchUserProjectCounts(userIds) {
    if (userIds.length === 0) return [];

    const sequelize = Client.sequelize;
    const placeholders = userIds.map(() => '?').join(',');
    
    try {
      const query = `
        SELECT 
          user_id,
          COUNT(project_id) as project_count
        FROM user_projects 
        WHERE user_id IN (${placeholders})
        GROUP BY user_id
      `;

      const results = await sequelize.query(query, {
        replacements: userIds,
        type: sequelize.QueryTypes.SELECT
      });

      return results.map(result => ({
        user_id: result.user_id,
        project_count: parseInt(result.project_count) || 0,
        get: function(field) {
          return field === 'project_count' ? this.project_count : this[field];
        }
      }));
    } catch (error) {
      console.error('Error fetching user project counts:', error);
      return [];
    }
  }

  /**
   * Fetch user communication details with accommodation information
   * @param {Array} userIds - Array of user IDs
   * @returns {Array} Communication details with accommodation
   */
  static async fetchUserCommunicationWithAccommodation(userIds) {
    const { UserCommunicationDetails, StaffAccommodation } = require('../../models');
    const { Op } = require('sequelize');

    return await UserCommunicationDetails.findAll({
      where: { user_id: { [Op.in]: userIds } },
      attributes: [
        'user_id',
        'communication_id',
        'communication_address',
        'country',
        'permanent_address',
        'pincode',
        'state',
        'phone_number',
        'emergency_contact_name',
        'emergency_contact_number',
        'accommodation_id',
        'bus_number'
      ],
      include: [
        {
          model: StaffAccommodation,
          as: 'accommodation',
          attributes: [
            'accommodation_id',
            'location',
            'city',
            'country',
            'created_at'
          ],
          required: false
        }
      ]
    });
  }

  /**
   * Fetch single staff member by ID
   * @param {number} staffId - Staff ID
   * @returns {Object} Staff data
   * @throws {Error} If staff not found
   */
  static async fetchStaffById(staffId) {
    const { User, Client, ClientRole } = require('../../models');

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

    return staff;
  }
}

module.exports = StaffDataFetcher;
