// src/utils/queryHelpers.js
const { Op } = require('sequelize');

class QueryHelpers {
  /**
   * Build advanced search condition for specific field or multiple fields
   * @param {string} searchTerm - Search term
   * @param {string|Array} fields - Single field or array of fields to search in
   * @param {string} searchType - Type of search: 'like', 'exact', 'starts_with', 'ends_with'
   * @returns {Object} Sequelize where condition
   */
  static buildAdvancedSearchCondition(searchTerm, fields, searchType = 'like') {
    if (!searchTerm) return {};

    const fieldsArray = Array.isArray(fields) ? fields : [fields];
    const conditions = [];

    fieldsArray.forEach(field => {
      switch (searchType) {
        case 'exact':
          conditions.push({ [field]: searchTerm });
          break;
        case 'starts_with':
          conditions.push({ [field]: { [Op.iLike]: `${searchTerm}%` } });
          break;
        case 'ends_with':
          conditions.push({ [field]: { [Op.iLike]: `%${searchTerm}` } });
          break;
        case 'like':
        default:
          conditions.push({ [field]: { [Op.iLike]: `%${searchTerm}%` } });
          break;
      }
    });

    return conditions.length === 1 ? conditions[0] : { [Op.or]: conditions };
  }

  /**
   * Build search condition for multiple fields (legacy method)
   * @param {string} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @returns {Object} Sequelize where condition
   */
  static buildSearchCondition(searchTerm, fields) {
    return this.buildAdvancedSearchCondition(searchTerm, fields, 'like');
  }

  /**
   * Build combinational filter conditions for OT and Face Registration
   * @param {string} otFilter - Overtime filter: 'enabled', 'disabled', 'all'
   * @param {string} faceFilter - Face registration filter: 'registered', 'not_registered', 'all'
   * @param {string} combinedFilter - Predefined combined filter
   * @returns {Object} Complex filter conditions for different query parts
   */
  static buildCombinationalFilterConditions(otFilter, faceFilter, combinedFilter) {
    // Handle predefined combined filters first
    if (combinedFilter && combinedFilter !== 'all') {
      return this.buildPredefinedCombinedFilter(combinedFilter);
    }

    // Build individual filters
    const conditions = {
      overtimeCondition: this.buildOvertimeCondition(otFilter),
      faceCondition: this.buildFaceRegistrationCondition(faceFilter),
      requiresComplexQuery: otFilter !== 'all' || faceFilter !== 'all'
    };

    return conditions;
  }

  /**
   * Build predefined combined filter conditions
   * @param {string} combinedFilter - Predefined combined filter type
   * @returns {Object} Filter conditions
   */
  static buildPredefinedCombinedFilter(combinedFilter) {
    const filterMap = {
      'ot_with_face': {
        overtimeCondition: this.buildOvertimeCondition('enabled'),
        faceCondition: this.buildFaceRegistrationCondition('registered'),
        requiresComplexQuery: true
      },
      'ot_without_face': {
        overtimeCondition: this.buildOvertimeCondition('enabled'),
        faceCondition: this.buildFaceRegistrationCondition('not_registered'),
        requiresComplexQuery: true
      },
      'non_ot_with_face': {
        overtimeCondition: this.buildOvertimeCondition('disabled'),
        faceCondition: this.buildFaceRegistrationCondition('registered'),
        requiresComplexQuery: true
      },
      'non_ot_without_face': {
        overtimeCondition: this.buildOvertimeCondition('disabled'),
        faceCondition: this.buildFaceRegistrationCondition('not_registered'),
        requiresComplexQuery: true
      },
      'all_ot': {
        overtimeCondition: this.buildOvertimeCondition('enabled'),
        faceCondition: this.buildFaceRegistrationCondition('all'),
        requiresComplexQuery: true
      },
      'all_non_ot': {
        overtimeCondition: this.buildOvertimeCondition('disabled'),
        faceCondition: this.buildFaceRegistrationCondition('all'),
        requiresComplexQuery: true
      },
      'all_with_face': {
        overtimeCondition: this.buildOvertimeCondition('all'),
        faceCondition: this.buildFaceRegistrationCondition('registered'),
        requiresComplexQuery: true
      },
      'all_without_face': {
        overtimeCondition: this.buildOvertimeCondition('all'),
        faceCondition: this.buildFaceRegistrationCondition('not_registered'),
        requiresComplexQuery: true
      }
    };

    return filterMap[combinedFilter] || {
      overtimeCondition: null,
      faceCondition: null,
      requiresComplexQuery: false
    };
  }

  /**
   * Build overtime condition
   * @param {string} otFilter - Overtime filter
   * @returns {string|null} SQL condition for overtime
   */
  static buildOvertimeCondition(otFilter) {
    switch (otFilter) {
      case 'enabled':
        return '(cr.use_overtime = true OR us.use_overtime = true)';
      case 'disabled':
        return '(cr.use_overtime IS NULL OR cr.use_overtime = false) AND (us.use_overtime IS NULL OR us.use_overtime = false)';
      case 'all':
      default:
        return null;
    }
  }

  /**
   * Build face registration condition
   * @param {string} faceFilter - Face registration filter
   * @returns {string|null} SQL condition for face registration
   */
  static buildFaceRegistrationCondition(faceFilter) {
    switch (faceFilter) {
      case 'registered':
        return 'up.photo_id IS NOT NULL';
      case 'not_registered':
        return 'up.photo_id IS NULL';
      case 'all':
      default:
        return null;
    }
  }

  /**
   * Build device type filter condition
   * @param {string} deviceFilter - Device filter: 'android', 'ios', 'none', 'all'
   * @returns {string|null} SQL condition for device filtering
   */
  static buildDeviceFilterCondition(deviceFilter) {
    switch (deviceFilter) {
      case 'android':
        return 'unt.device_type = \'android\'';
      case 'ios':
        return 'unt.device_type = \'ios\'';
      case 'none':
        return 'NOT EXISTS (SELECT 1 FROM user_notification_tokens unt2 WHERE unt2.user_id = cu.user_id)';
      case 'all':
      default:
        return null;
    }
  }

  /**
   * Build project count filter condition
   * @param {string} projectsFilter - Projects filter: 'single', 'multi', 'none', 'all'
   * @returns {string|null} SQL condition for project count filtering
   */
  static buildProjectCountFilterCondition(projectsFilter) {
    switch (projectsFilter) {
      case 'single':
        return '(SELECT COUNT(*) FROM user_projects up WHERE up.user_id = cu.user_id) = 1';
      case 'multi':
        return '(SELECT COUNT(*) FROM user_projects up WHERE up.user_id = cu.user_id) > 1';
      case 'none':
        return 'NOT EXISTS (SELECT 1 FROM user_projects up WHERE up.user_id = cu.user_id)';
      case 'all':
      default:
        return null;
    }
  }

  /**
   * NEW: Build project-based filter condition (filter users by specific project)
   * @param {number} projectId - Project ID to filter by
   * @returns {string|null} SQL condition for project-based filtering
   */
  static buildProjectBasedFilterCondition(projectId) {
    if (!projectId || isNaN(projectId)) {
      return null;
    }
    
    return `EXISTS (SELECT 1 FROM user_projects up WHERE up.user_id = cu.user_id AND up.project_id = ${parseInt(projectId)})`;
  }

  /**
   * Build salary range filter conditions
   * @param {string} salaryField - Salary field to filter on ('take_home', 'basic_salary', 'ctc')
   * @param {number} minSalary - Minimum salary value
   * @param {number} maxSalary - Maximum salary value
   * @param {string} currency - Currency filter (optional)
   * @returns {Object} Sequelize where condition for salary filtering
   */
  static buildSalaryRangeCondition(salaryField, minSalary, maxSalary, currency = null) {
    if (!salaryField) return {};

    const salaryConditions = {};
    const currencyCondition = {};

    // Build salary range condition
    if (minSalary !== null && minSalary !== undefined) {
      salaryConditions[Op.gte] = parseFloat(minSalary);
    }

    if (maxSalary !== null && maxSalary !== undefined) {
      salaryConditions[Op.lte] = parseFloat(maxSalary);
    }

    // Build currency condition if provided
    if (currency) {
      currencyCondition.currency = currency;
    }

    // Combine conditions
    const finalCondition = {};
    
    if (Object.keys(salaryConditions).length > 0) {
      finalCondition[salaryField] = salaryConditions;
    }

    if (Object.keys(currencyCondition).length > 0) {
      Object.assign(finalCondition, currencyCondition);
    }

    return Object.keys(finalCondition).length > 0 ? finalCondition : {};
  }

  /**
   * Build SQL condition for salary range in raw queries
   * @param {string} salaryField - Salary field to filter on
   * @param {number} minSalary - Minimum salary value
   * @param {number} maxSalary - Maximum salary value
   * @param {string} currency - Currency filter (optional)
   * @returns {string} SQL WHERE clause condition
   */
  static buildSalaryRangeSQL(salaryField, minSalary, maxSalary, currency = null) {
    if (!salaryField) return '';

    const conditions = [];

    if (minSalary !== null && minSalary !== undefined) {
      conditions.push(`us.${salaryField} >= :minSalary`);
    }

    if (maxSalary !== null && maxSalary !== undefined) {
      conditions.push(`us.${salaryField} <= :maxSalary`);
    }

    if (currency) {
      conditions.push(`us.currency = :currency`);
    }

    return conditions.length > 0 ? `AND (${conditions.join(' AND ')})` : '';
  }

  /**
   * Build order condition
   * @param {string} orderBy - Field to order by
   * @param {string} direction - Order direction (ASC/DESC)
   * @param {Array} allowedFields - Allowed fields for ordering
   * @returns {Array} Sequelize order condition
   */
  static buildOrderCondition(orderBy = 'created_at', direction = 'DESC', allowedFields = []) {
    const validOrderBy = allowedFields.includes(orderBy) ? orderBy : allowedFields[0] || 'created_at';
    const validDirection = ['ASC', 'DESC'].includes(direction.toUpperCase()) ? direction.toUpperCase() : 'DESC';

    return [[validOrderBy, validDirection]];
  }

  /**
   * Build status filter condition
   * @param {string} status - Status filter value
   * @returns {Object} Sequelize where condition
   */
  static buildStatusCondition(status) {
    if (status === null || status === undefined) return {};
    return { current_active: status === 'active' };
  }

  /**
   * Create lookup map from array
   * @param {Array} array - Array of objects
   * @param {string} keyField - Field to use as key
   * @param {boolean} isArray - Whether to group values in arrays
   * @returns {Object} Lookup map
   */
  static createLookupMap(array, keyField, isArray = false) {
    const map = {};
    array.forEach(item => {
      const key = item[keyField];
      if (isArray) {
        if (!map[key]) map[key] = [];
        map[key].push(item);
      } else {
        map[key] = item;
      }
    });
    return map;
  }

  /**
   * Validate and get database field name from search alias
   * @param {string} searchField - Search field alias (e.g., 'name', 'phone')
   * @param {Object} fieldMapping - Mapping of aliases to actual database fields
   * @returns {string|null} Database field name or null if invalid
   */
  static getDbFieldName(searchField, fieldMapping) {
    return fieldMapping[searchField] || null;
  }
}

module.exports = QueryHelpers;
