// src/models/UserJobProfile.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserJobProfile = sequelize.define('user_job_profiles', {
    user_profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_job_profile',
        key: 'job_profile_id'
      }
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_departments',
        key: 'department_id'
      }
    },
    contract_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    skill_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    reporting_to: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reportees: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    profileinfo: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'user_job_profiles'
  });

  return UserJobProfile;
};
