// src/services/ProjectService.js
const { Client } = require('../models');

class ProjectService {
  /**
   * Get all projects for a specific client (for filter options)
   * @param {number} clientId - Client ID
   * @returns {Array} List of projects with id and name
   */
  static async getProjectsForClient(clientId) {
    if (!clientId || isNaN(clientId)) {
      throw new Error('Invalid client ID provided');
    }

    try {
      // Using raw SQL to get projects for client
      const sequelize = Client.sequelize;
      
      const query = `
        SELECT 
          project_id as id,
          project_name as name
        FROM client_projects 
        WHERE client_id = :clientId 
        ORDER BY project_name ASC
      `;

      const projects = await sequelize.query(query, {
        replacements: { clientId: parseInt(clientId) },
        type: sequelize.QueryTypes.SELECT
      });

      return projects.map(project => ({
        id: project.id,
        name: project.name
      }));

    } catch (error) {
      throw new Error(`Failed to fetch projects for client: ${error.message}`);
    }
  }

  /**
   * Verify if project belongs to client
   * @param {number} clientId - Client ID
   * @param {number} projectId - Project ID
   * @returns {boolean} True if project belongs to client
   */
  static async verifyProjectBelongsToClient(clientId, projectId) {
    if (!clientId || isNaN(clientId) || !projectId || isNaN(projectId)) {
      return false;
    }

    try {
      const sequelize = Client.sequelize;
      
      const query = `
        SELECT 1 
        FROM client_projects 
        WHERE client_id = :clientId AND project_id = :projectId
        LIMIT 1
      `;

      const result = await sequelize.query(query, {
        replacements: { 
          clientId: parseInt(clientId),
          projectId: parseInt(projectId)
        },
        type: sequelize.QueryTypes.SELECT
      });

      return result.length > 0;

    } catch (error) {
      console.error('Error verifying project ownership:', error);
      return false;
    }
  }
}

module.exports = ProjectService;
