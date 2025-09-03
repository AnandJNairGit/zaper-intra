// src/services/staff/StaffQueryBuilder.js
const { Op } = require('sequelize');
const { 
  USER_ATTRIBUTES, 
  CLIENT_ATTRIBUTES, 
  ROLE_ATTRIBUTES, 
  STAFF_ATTRIBUTES,
  STAFF_CONSTANTS
} = require('../../utils/constants');
const QueryHelpers = require('../../utils/queryHelpers');

class StaffQueryBuilder {
  /**
   * ENHANCED: Build main staff query options with project-based filters
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Sequelize query options
   */
  static buildStaffQuery(clientId, options) {
    const { 
      page, limit, search, searchField, searchType, status, orderBy, orderDirection,
      otFilter, faceFilter, combinedFilter, salaryField, minSalary, maxSalary, currency, 
      deviceFilter, projectsFilter, projectId
    } = options;
    
    const offset = (page - 1) * limit;

    // Check if we need complex filtering
    const filterConditions = QueryHelpers.buildCombinationalFilterConditions(
      otFilter, faceFilter, combinedFilter
    );

    const hasSalaryFilter = salaryField && (minSalary !== null || maxSalary !== null);
    const hasDeviceFilter = deviceFilter && deviceFilter !== 'all';
    const hasProjectsFilter = projectsFilter && projectsFilter !== 'all';
    const hasProjectIdFilter = projectId !== null && projectId !== undefined;

    if (filterConditions.requiresComplexQuery || hasSalaryFilter || hasDeviceFilter || hasProjectsFilter || hasProjectIdFilter) {
      return this.buildComplexStaffQuery(clientId, options, filterConditions);
    } else {
      return this.buildSimpleStaffQuery(clientId, options);
    }
  }

  /**
   * Build simple staff query for basic filtering
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Sequelize query options
   */
  static buildSimpleStaffQuery(clientId, options) {
    const { page, limit, search, searchField, searchType, status, orderBy, orderDirection } = options;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { client_id: clientId };
    Object.assign(whereClause, QueryHelpers.buildStatusCondition(status));

    // Build search condition for included user
    const includeWhere = this.buildSearchCondition(search, searchField, searchType);

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
   * ENHANCED: Build complex staff query with all filter types including project-based filtering
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @param {Object} filterConditions - Filter conditions
   * @returns {Object} Raw SQL query options
   */
  static buildComplexStaffQuery(clientId, options, filterConditions) {
    const { 
      page, limit, search, searchField, searchType, status, orderBy, orderDirection,
      salaryField, minSalary, maxSalary, currency, deviceFilter, projectsFilter, projectId
    } = options;
    const offset = (page - 1) * limit;

    // Build search condition
    let searchCondition = '';
    if (search) {
      if (searchField) {
        const dbField = QueryHelpers.getDbFieldName(searchField, STAFF_CONSTANTS.SEARCHABLE_FIELDS);
        if (dbField && ['display_name', 'user_name', 'phone_number', 'emailid'].includes(dbField)) {
          switch (searchType) {
            case 'exact':
              searchCondition = `AND u.${dbField} = :search`;
              break;
            case 'starts_with':
              searchCondition = `AND u.${dbField} ILIKE :searchStart`;
              break;
            case 'ends_with':
              searchCondition = `AND u.${dbField} ILIKE :searchEnd`;
              break;
            default:
              searchCondition = `AND u.${dbField} ILIKE :searchLike`;
              break;
          }
        }
      } else {
        searchCondition = `AND (
          u.display_name ILIKE :searchLike OR 
          u.user_name ILIKE :searchLike OR 
          u.phone_number ILIKE :searchLike OR 
          u.emailid ILIKE :searchLike
        )`;
      }
    }

    // Build status condition
    let statusCondition = '';
    if (status) {
      statusCondition = `AND cu.current_active = :statusValue`;
    }

    // Build combinational filter conditions
    let combinationalCondition = '';
    const conditions = [];
    
    if (filterConditions.overtimeCondition) {
      conditions.push(filterConditions.overtimeCondition);
    }
    
    if (filterConditions.faceCondition) {
      conditions.push(filterConditions.faceCondition);
    }
    
    if (conditions.length > 0) {
      combinationalCondition = `AND (${conditions.join(' AND ')})`;
    }

    // Build salary filter condition
    let salaryCondition = '';
    if (salaryField) {
      salaryCondition = QueryHelpers.buildSalaryRangeSQL(salaryField, minSalary, maxSalary, currency);
    }

    // Build device filter condition
    let deviceCondition = '';
    if (deviceFilter && deviceFilter !== 'all') {
      const deviceFilterSQL = QueryHelpers.buildDeviceFilterCondition(deviceFilter);
      if (deviceFilterSQL) {
        deviceCondition = `AND (${deviceFilterSQL})`;
      }
    }

    // Build project count filter condition
    let projectsCondition = '';
    if (projectsFilter && projectsFilter !== 'all') {
      const projectsFilterSQL = QueryHelpers.buildProjectCountFilterCondition(projectsFilter);
      if (projectsFilterSQL) {
        projectsCondition = `AND (${projectsFilterSQL})`;
      }
    }

    // NEW: Build project-based filter condition
    let projectIdCondition = '';
    if (projectId !== null && projectId !== undefined) {
      const projectIdFilterSQL = QueryHelpers.buildProjectBasedFilterCondition(projectId);
      if (projectIdFilterSQL) {
        projectIdCondition = `AND (${projectIdFilterSQL})`;
      }
    }

    // Determine JOIN strategy based on device filter
    let deviceJoin = '';
    if (deviceFilter === 'none') {
      deviceJoin = '';
    } else if (deviceFilter === 'android' || deviceFilter === 'ios') {
      deviceJoin = 'INNER JOIN user_notification_tokens unt ON unt.user_id = cu.user_id';
    } else {
      deviceJoin = 'LEFT JOIN user_notification_tokens unt ON unt.user_id = cu.user_id';
    }

    // Build order clause
    let orderClause = '';
    switch (orderBy) {
      case 'name':
        orderClause = `ORDER BY u.display_name ${orderDirection}`;
        break;
      case 'joining_date':
        orderClause = `ORDER BY cu.joining_date ${orderDirection}`;
        break;
      case 'status':
        orderClause = `ORDER BY cu.current_active ${orderDirection}`;
        break;
      case 'code':
        orderClause = `ORDER BY cu.code ${orderDirection}`;
        break;
      default:
        orderClause = `ORDER BY cu.created_at ${orderDirection}`;
        break;
    }

    // Build the complete raw query
    const rawQuery = `
      SELECT
        cu.staff_id,
        cu.client_id,
        cu.user_id,
        cu.role_id,
        cu.joining_date,
        cu.current_active,
        cu.code,
        cu.vendor_id,
        cu.permissions::text as permissions_text,
        cu.project_permissions::text as project_permissions_text,
        cu.created_at,
        
        -- User details
        u.user_id as "user.user_id",
        u.user_name as "user.user_name",
        u.display_name as "user.display_name",
        u.phone_number as "user.phone_number",
        u.gender as "user.gender",
        u.religion as "user.religion",
        u.skills_and_proficiency as "user.skills_and_proficiency",
        u.language_spoken as "user.language_spoken",
        u.education as "user.education",
        u.date_of_birth as "user.date_of_birth",
        u.description as "user.description",
        u.emailid as "user.emailid",
        u.profile_image as "user.profile_image",
        u.skill_type as "user.skill_type",
        u.zaper_skills as "user.zaper_skills",
        u.type as "user.type",
        
        -- Client details
        c.client_id as "client.client_id",
        c.client_name as "client.client_name",
        c.region as "client.region",
        c.currency as "client.currency",
        
        -- Role details
        cr.role_id as "role.role_id",
        cr.role_name as "role.role_name",
        cr.use_overtime as "role.use_overtime",
        cr.ot_above_hour as "role.ot_above_hour",
        cr.regular_ot as "role.regular_ot",
        cr.holiday_pay_rate as "role.holiday_pay_rate",
        cr.sick_leave_eligibility as "role.sick_leave_eligibility",
        cr.annual_leave_eligibility as "role.annual_leave_eligibility",
        cr.insurance_eligibility as "role.insurance_eligibility",
        cr.air_ticket_eligibility as "role.air_ticket_eligibility"
        
      FROM client_users cu
      INNER JOIN users u ON u.user_id = cu.user_id
      INNER JOIN clients c ON c.client_id = cu.client_id
      LEFT JOIN client_roles cr ON cr.role_id = cu.role_id
      LEFT JOIN user_salary us ON us.user_id = cu.user_id
      LEFT JOIN user_photos up ON up.user_id = cu.user_id
      ${deviceJoin}
      
      WHERE cu.client_id = :clientId
      ${statusCondition}
      ${searchCondition}
      ${combinationalCondition}
      ${salaryCondition}
      ${deviceCondition}
      ${projectsCondition}
      ${projectIdCondition}
      
      ${orderClause}
      LIMIT :limit OFFSET :offset
    `;

    // Build count query with same conditions
    const countQuery = `
      SELECT COUNT(DISTINCT cu.staff_id) as count
      FROM client_users cu
      INNER JOIN users u ON u.user_id = cu.user_id
      LEFT JOIN client_roles cr ON cr.role_id = cu.role_id
      LEFT JOIN user_salary us ON us.user_id = cu.user_id
      LEFT JOIN user_photos up ON up.user_id = cu.user_id
      ${deviceFilter === 'none' ? '' : (deviceFilter === 'android' || deviceFilter === 'ios') ? 'INNER JOIN user_notification_tokens unt ON unt.user_id = cu.user_id' : 'LEFT JOIN user_notification_tokens unt ON unt.user_id = cu.user_id'}
      
      WHERE cu.client_id = :clientId
      ${statusCondition}
      ${searchCondition}
      ${combinationalCondition}
      ${salaryCondition}
      ${deviceCondition}
      ${projectsCondition}
      ${projectIdCondition}
    `;

    // Prepare replacements
    const replacements = {
      clientId: parseInt(clientId),
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    if (status) {
      replacements.statusValue = status === 'active';
    }

    if (search) {
      if (searchType === 'starts_with') {
        replacements.searchStart = `${search}%`;
      } else if (searchType === 'ends_with') {
        replacements.searchEnd = `%${search}`;
      } else if (searchType === 'exact') {
        replacements.search = search;
      } else {
        replacements.searchLike = `%${search}%`;
      }
    }

    // Add salary filter replacements
    if (salaryField) {
      if (minSalary !== null && minSalary !== undefined) {
        replacements.minSalary = minSalary;
      }
      if (maxSalary !== null && maxSalary !== undefined) {
        replacements.maxSalary = maxSalary;
      }
      if (currency) {
        replacements.currency = currency;
      }
    }

    return {
      isRawQuery: true,
      query: rawQuery,
      countQuery: countQuery,
      replacements: replacements
    };
  }

  /**
   * Build enhanced search condition
   * @param {string} search - Search term
   * @param {string} searchField - Specific field to search in
   * @param {string} searchType - Type of search
   * @returns {Object} Search condition
   */
  static buildSearchCondition(search, searchField, searchType) {
    if (!search) return {};

    if (searchField) {
      const dbField = QueryHelpers.getDbFieldName(searchField, STAFF_CONSTANTS.SEARCHABLE_FIELDS);
      if (dbField) {
        if (dbField === 'code' || dbField === 'current_active') {
          return {};
        }
        return QueryHelpers.buildAdvancedSearchCondition(search, [dbField], searchType);
      }
    } else {
      const userTextFields = STAFF_CONSTANTS.TEXT_SEARCHABLE_FIELDS.filter(field => 
        ['display_name', 'user_name', 'phone_number', 'emailid', 'gender', 'religion', 
         'education', 'skills_and_proficiency', 'language_spoken', 'skill_type', 'type'].includes(field)
      );
      return QueryHelpers.buildAdvancedSearchCondition(search, userTextFields, searchType);
    }

    return {};
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
          attributes: ['user_id', 'photo_id', 'photo_type', 'saved_to_vector', 'photo_url']
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
