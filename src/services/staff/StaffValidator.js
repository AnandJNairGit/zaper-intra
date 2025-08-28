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
   * Validate and sanitize query options with enhanced search and combinational filters
   * @param {Object} options - Query options
   * @returns {Object} Validated options
   */
  static validateQueryOptions(options = {}) {
    const {
      page = STAFF_CONSTANTS.DEFAULT_PAGINATION.PAGE,
      limit = STAFF_CONSTANTS.DEFAULT_PAGINATION.LIMIT,
      search = '',
      searchField = null,
      searchType = 'like',
      status = null,
      orderBy = 'joining_date',
      orderDirection = 'DESC',
      // NEW: Combinational filter parameters
      otFilter = 'all',
      faceFilter = 'all',
      combinedFilter = null
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
    const validStatus = [
      STAFF_CONSTANTS.STATUS_VALUES.ACTIVE, 
      STAFF_CONSTANTS.STATUS_VALUES.INACTIVE
    ].includes(status) ? status : null;

    // Validate search parameters
    const validSearchField = searchField && 
      Object.keys(STAFF_CONSTANTS.SEARCHABLE_FIELDS).includes(searchField) 
      ? searchField 
      : null;

    const validSearchType = ['like', 'exact', 'starts_with', 'ends_with'].includes(searchType)
      ? searchType
      : 'like';

    // NEW: Validate combinational filter parameters
    const validOtFilter = Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.OT_FILTERS)
      .includes(otFilter) ? otFilter : 'all';

    const validFaceFilter = Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.FACE_FILTERS)
      .includes(faceFilter) ? faceFilter : 'all';

    const validCombinedFilter = combinedFilter && 
      Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.COMBINED_FILTERS)
      .includes(combinedFilter) ? combinedFilter : null;

    return {
      page: validatedPage,
      limit: validatedLimit,
      search: search.toString().trim(),
      searchField: validSearchField,
      searchType: validSearchType,
      status: validStatus,
      orderBy: validOrderBy,
      orderDirection: validDirection,
      // NEW: Validated combinational filters
      otFilter: validOtFilter,
      faceFilter: validFaceFilter,
      combinedFilter: validCombinedFilter
    };
  }

  /**
   * Get available search fields for API documentation
   * @returns {Array} Array of searchable field objects
   */
  static getSearchableFields() {
    return Object.keys(STAFF_CONSTANTS.SEARCHABLE_FIELDS).map(alias => ({
      alias,
      field: STAFF_CONSTANTS.SEARCHABLE_FIELDS[alias],
      type: STAFF_CONSTANTS.TEXT_SEARCHABLE_FIELDS.includes(
        STAFF_CONSTANTS.SEARCHABLE_FIELDS[alias]
      ) ? 'text' : 'exact'
    }));
  }

  /**
   * NEW: Get available combinational filter options
   * @returns {Object} Available filter options
   */
  static getCombinationalFilterOptions() {
    return {
      otFilters: Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.OT_FILTERS),
      faceFilters: Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.FACE_FILTERS),
      combinedFilters: Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.COMBINED_FILTERS),
      descriptions: {
        otFilters: {
          enabled: 'Staff with overtime enabled',
          disabled: 'Staff without overtime enabled',
          all: 'All staff regardless of overtime status'
        },
        faceFilters: {
          registered: 'Staff with face registered',
          not_registered: 'Staff without face registered', 
          all: 'All staff regardless of face registration'
        },
        combinedFilters: {
          ot_with_face: 'OT enabled staff with face registered',
          ot_without_face: 'OT enabled staff without face registered',
          non_ot_with_face: 'Non-OT staff with face registered',
          non_ot_without_face: 'Non-OT staff without face registered',
          all_ot: 'All OT enabled staff',
          all_non_ot: 'All non-OT enabled staff',
          all_with_face: 'All staff with face registered',
          all_without_face: 'All staff without face registered',
          all: 'All staff (no filters)'
        }
      }
    };
  }
}

module.exports = StaffValidator;
 