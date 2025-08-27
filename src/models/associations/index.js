// src/models/associations/index.js
const clientAssociations = require('./clientAssociations');
const userAssociations = require('./userAssociations');
const staffAssociations = require('./staffAssociations');
const auditAssociations = require('./auditAssociations');
const communicationAssociations = require('./communicationAssociations');

/**
 * Main associations orchestrator
 * Applies all modular associations to the database models
 * @param {Object} db - Database models object
 */
module.exports = (db) => {
  // Apply associations in logical order
  clientAssociations(db);
  userAssociations(db);
  staffAssociations(db);
  auditAssociations(db);
  communicationAssociations(db);

  console.log('✅ All model associations have been established');
};
