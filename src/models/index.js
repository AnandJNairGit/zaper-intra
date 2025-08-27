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
