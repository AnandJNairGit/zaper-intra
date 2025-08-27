// src/utils/pagination.js
class PaginationHelper {
  /**
   * Calculate pagination metadata
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items count
   * @returns {Object} Pagination metadata
   */
  static calculatePagination(page, limit, total) {
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      total,
      page: currentPage,
      limit: itemsPerPage,
      total_pages: totalPages,
      has_next: currentPage * itemsPerPage < total,
      has_prev: currentPage > 1,
      offset: (currentPage - 1) * itemsPerPage
    };
  }

  /**
   * Validate pagination parameters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Validated parameters
   */
  static validatePaginationParams(page = 1, limit = 50) {
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));

    return {
      page: validatedPage,
      limit: validatedLimit
    };
  }
}

module.exports = PaginationHelper;

