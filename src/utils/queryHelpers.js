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
