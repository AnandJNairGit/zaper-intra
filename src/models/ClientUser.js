const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClientUser = sequelize.define('client_users', {
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'client_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client_roles',
        key: 'role_id'
      }
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'vendor_id'
      }
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    project_permissions: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'client_users'
  });

  return ClientUser;
};
