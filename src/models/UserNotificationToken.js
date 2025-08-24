// src/models/UserNotificationToken.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserNotificationToken = sequelize.define('user_notification_tokens', {
    token_id: {
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
    notification_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    package_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'user_notification_tokens'
  });

  return UserNotificationToken;
};
