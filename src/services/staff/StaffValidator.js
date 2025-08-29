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
   * Validate and sanitize query options with enhanced search, combinational filters, and salary filters
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
      // Combinational filter parameters
      otFilter = 'all',
      faceFilter = 'all',
      combinedFilter = null,
      // NEW: Salary filter parameters
      salaryField = null,
      minSalary = null,
      maxSalary = null,
      currency = null
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

    // Validate combinational filter parameters
    const validOtFilter = Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.OT_FILTERS)
      .includes(otFilter) ? otFilter : 'all';

    const validFaceFilter = Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.FACE_FILTERS)
      .includes(faceFilter) ? faceFilter : 'all';

    const validCombinedFilter = combinedFilter && 
      Object.values(STAFF_CONSTANTS.COMBINATIONAL_FILTERS.COMBINED_FILTERS)
      .includes(combinedFilter) ? combinedFilter : null;

    // NEW: Validate salary filter parameters
    const validSalaryField = salaryField && 
      STAFF_CONSTANTS.SALARY_FILTERS.FIELDS.includes(salaryField) 
      ? salaryField 
      : null;

    let validMinSalary = null;
    let validMaxSalary = null;

    if (minSalary !== null && minSalary !== undefined) {
      const parsedMin = parseFloat(minSalary);
      if (!isNaN(parsedMin) && parsedMin >= 0) {
        validMinSalary = parsedMin;
      }
    }

    if (maxSalary !== null && maxSalary !== undefined) {
      const parsedMax = parseFloat(maxSalary);
      if (!isNaN(parsedMax) && parsedMax >= 0) {
        validMaxSalary = parsedMax;
      }
    }

    // Validate salary range logic
    if (validMinSalary !== null && validMaxSalary !== null && validMinSalary > validMaxSalary) {
      // Swap values if min > max
      [validMinSalary, validMaxSalary] = [validMaxSalary, validMinSalary];
    }

    const validCurrency = currency && 
      STAFF_CONSTANTS.SALARY_FILTERS.SUPPORTED_CURRENCIES.includes(currency.toUpperCase())
      ? currency.toUpperCase()
      : null;

    return {
      page: validatedPage,
      limit: validatedLimit,
      search: search.toString().trim(),
      searchField: validSearchField,
      searchType: validSearchType,
      status: validStatus,
      orderBy: validOrderBy,
      orderDirection: validDirection,
      // Combinational filters
      otFilter: validOtFilter,
      faceFilter: validFaceFilter,
      combinedFilter: validCombinedFilter,
      // NEW: Salary filters
      salaryField: validSalaryField,
      minSalary: validMinSalary,
      maxSalary: validMaxSalary,
      currency: validCurrency
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
   * Get available combinational filter options
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

  /**
   * NEW: Get available salary filter options
   * @returns {Object} Available salary filter options
   */
  static getSalaryFilterOptions() {
    return {
      salaryFields: STAFF_CONSTANTS.SALARY_FILTERS.FIELDS,
      supportedCurrencies: STAFF_CONSTANTS.SALARY_FILTERS.SUPPORTED_CURRENCIES,
      defaultCurrency: STAFF_CONSTANTS.SALARY_FILTERS.DEFAULT_CURRENCY,
      descriptions: {
        take_home: 'Net take-home salary after deductions',
        basic_salary: 'Basic salary before allowances',
        ctc: 'Cost to Company (total compensation)'
      },
      examples: {
        basicUsage: 'salaryField=basic_salary&minSalary=50000&maxSalary=100000',
        withCurrency: 'salaryField=ctc&minSalary=80000&currency=USD',
        combined: 'salaryField=take_home&minSalary=40000&combinedFilter=ot_with_face'
      }
    };
  }
}

module.exports = StaffValidator;
