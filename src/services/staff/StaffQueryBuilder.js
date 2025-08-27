// src/services/staff/StaffQueryBuilder.js
const { Op } = require('sequelize');
const { 
  USER_ATTRIBUTES, 
  CLIENT_ATTRIBUTES, 
  ROLE_ATTRIBUTES, 
  STAFF_ATTRIBUTES 
} = require('../../utils/constants');
const QueryHelpers = require('../../utils/queryHelpers');

class StaffQueryBuilder {
  /**
   * Build main staff query options
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Sequelize query options
   */
  static buildStaffQuery(clientId, options) {
    const { page, limit, search, status, orderBy, orderDirection } = options;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { client_id: clientId };
    Object.assign(whereClause, QueryHelpers.buildStatusCondition(status));

    // Build search condition for included user
    const includeWhere = QueryHelpers.buildSearchCondition(search, ['user_name', 'display_name', 'phone_number']);

    return {
      where: whereClause,
      attributes: STAFF_ATTRIBUTES,
      include: this.buildIncludeOptions(includeWhere),
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderBy, orderDirection.toUpperCase()]],
      distinct: true
    };
  }

  /**
   * Build include options for associated models
   * @param {Object} includeWhere - Where condition for user search
   * @returns {Array} Sequelize include options
   */
  static buildIncludeOptions(includeWhere) {
    const { User, Client, ClientRole } = require('../../models');

    return [
      {
        model: User,
        as: 'user',
        where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
        attributes: USER_ATTRIBUTES
      },
      {
        model: Client,
        as: 'client',
        attributes: CLIENT_ATTRIBUTES
      },
      {
        model: ClientRole,
        as: 'role',
        required: false,
        attributes: ROLE_ATTRIBUTES
      }
    ];
  }

  /**
   * Build batch queries for related data
   * @param {Array} userIds - Array of user IDs
   * @returns {Object} Batch query options
   */
  static buildBatchQueries(userIds) {
    const { UserPhoto, UserJobProfile, UserSalary, UserNotificationToken, ClientJobProfile } = require('../../models');

    return {
      userPhotos: {
        model: UserPhoto,
        options: {
          where: { user_id: { [Op.in]: userIds } },
          attributes: ['user_id', 'photo_id', 'photo_type', 'saved_to_vector']
        }
      },
      userJobProfiles: {
        model: UserJobProfile,
        options: {
          where: { user_id: { [Op.in]: userIds } },
          attributes: ['user_id', 'profile_id', 'contract_type', 'skill_type', 'reporting_to', 'reportees', 'profileinfo'],
          include: [{
            model: ClientJobProfile,
            as: 'jobProfile',
            attributes: ['job_profile_id', 'job_profile_name']
          }]
        }
      },
      userSalaries: {
        model: UserSalary,
        options: {
          where: { user_id: { [Op.in]: userIds } },
          attributes: ['user_id', 'take_home', 'basic_salary', 'ctc', 'currency', 'use_overtime']
        }
      },
      notificationTokens: {
        model: UserNotificationToken,
        options: {
          where: { user_id: { [Op.in]: userIds } },
          attributes: ['user_id', 'device_type', 'created_at']
        }
      }
    };
  }
}

module.exports = StaffQueryBuilder;
