// src/services/staff/StaffValidator.js
const { STAFF_CONSTANTS } = require('../../utils/constants');

class StaffValidator {
  /**
   * Validate client ID
   * @param {*} clientId - Client ID to validate
   * @throws {Error} If client ID is invalid
   */
  static validateClientId(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }
  }

  /**
   * Validate staff ID
   * @param {*} staffId - Staff ID to validate
   * @throws {Error} If staff ID is invalid
   */
  static validateStaffId(staffId) {
    if (!staffId || isNaN(staffId)) {
      throw new Error('Invalid staff ID provided');
    }
  }

  /**
   * Validate and sanitize query options
   * @param {Object} options - Query options
   * @returns {Object} Validated options
   */
  static validateQueryOptions(options = {}) {
    const {
      page = STAFF_CONSTANTS.DEFAULT_PAGINATION.PAGE,
      limit = STAFF_CONSTANTS.DEFAULT_PAGINATION.LIMIT,
      search = '',
      status = null,
      orderBy = 'joining_date',
      orderDirection = 'DESC'
    } = options;

    // Validate pagination
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(
      STAFF_CONSTANTS.DEFAULT_PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(limit) || STAFF_CONSTANTS.DEFAULT_PAGINATION.LIMIT)
    );

    // Validate orderBy field
    const validOrderBy = STAFF_CONSTANTS.ALLOWED_ORDER_FIELDS.includes(orderBy) 
      ? orderBy 
      : 'joining_date';

    // Validate order direction
    const validDirection = ['ASC', 'DESC'].includes(orderDirection.toUpperCase()) 
      ? orderDirection.toUpperCase() 
      : 'DESC';

    // Validate status
    const validStatus = status === STAFF_CONSTANTS.STATUS_VALUES.ACTIVE || 
                       status === STAFF_CONSTANTS.STATUS_VALUES.INACTIVE 
      ? status 
      : null;

    return {
      page: validatedPage,
      limit: validatedLimit,
      search: search.toString().trim(),
      status: validStatus,
      orderBy: validOrderBy,
      orderDirection: validDirection
    };
  }
}

module.exports = StaffValidator;
