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
   * Fetch main staff data with pagination
   * @param {number} clientId - Client ID
   * @param {Object} options - Query options
   * @returns {Object} Staff data with count
   */
  static async fetchStaffData(clientId, options) {
    const queryOptions = StaffQueryBuilder.buildStaffQuery(clientId, options);
    return await ClientUser.findAndCountAll(queryOptions);
  }

  /**
   * Fetch related data in batches
   * @param {Array} userIds - Array of user IDs
   * @returns {Object} Related data maps
   */
  static async fetchRelatedData(userIds) {
    if (userIds.length === 0) {
      return {
        photosMap: {},
        jobProfilesMap: {},
        salariesMap: {},
        tokensMap: {}
      };
    }

    const batchQueries = StaffQueryBuilder.buildBatchQueries(userIds);

    // Execute all batch queries concurrently
    const [userPhotos, userJobProfiles, userSalaries, notificationTokens] = await Promise.all([
      batchQueries.userPhotos.model.findAll(batchQueries.userPhotos.options),
      batchQueries.userJobProfiles.model.findAll(batchQueries.userJobProfiles.options),
      batchQueries.userSalaries.model.findAll(batchQueries.userSalaries.options),
      batchQueries.notificationTokens.model.findAll(batchQueries.notificationTokens.options)
    ]);

    // Create lookup maps
    return {
      photosMap: QueryHelpers.createLookupMap(userPhotos, 'user_id', true),
      jobProfilesMap: QueryHelpers.createLookupMap(userJobProfiles, 'user_id', false),
      salariesMap: QueryHelpers.createLookupMap(userSalaries, 'user_id', false),
      tokensMap: QueryHelpers.createLookupMap(notificationTokens, 'user_id', true)
    };
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
