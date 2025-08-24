// src/models/ClientJobProfile.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClientJobProfile = sequelize.define('client_job_profile', {
    job_profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    job_profile_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'client_id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'client_job_profile'
  });

  return ClientJobProfile;
};
