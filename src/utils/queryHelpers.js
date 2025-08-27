// src/utils/queryHelpers.js
const { Op } = require('sequelize');

class QueryHelpers {
  /**
   * Build search condition for multiple fields
   * @param {string} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @returns {Object} Sequelize where condition
   */
  static buildSearchCondition(searchTerm, fields) {
    if (!searchTerm || !fields.length) return {};

    return {
      [Op.or]: fields.map(field => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` }
      }))
    };
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
}

module.exports = QueryHelpers;
