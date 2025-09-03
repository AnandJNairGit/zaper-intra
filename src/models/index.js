// src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Add global hook to fix findAndCountAll bug with associations
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (options.include && options.include.length > 0) {
    options.include = null;
  }
});

const db = {};

// Import all models
db.Client = require('./Client')(sequelize);
db.ClientProject = require('./ClientProject')(sequelize);
db.ClientUser = require('./ClientUser')(sequelize);
db.ClientRole = require('./ClientRole')(sequelize);
db.ClientJobProfile = require('./ClientJobProfile')(sequelize);
db.User = require('./User')(sequelize);
db.UserPhoto = require('./UserPhoto')(sequelize);
db.UserSalary = require('./UserSalary')(sequelize);
db.UserJobProfile = require('./UserJobProfile')(sequelize);
db.UserNotificationToken = require('./UserNotificationToken')(sequelize);
db.StaffAccommodation = require('./StaffAccommodation')(sequelize);
db.UserCommunicationDetails = require('./UserCommunicationDetails')(sequelize);

// Apply modular associations
require('./associations')(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
