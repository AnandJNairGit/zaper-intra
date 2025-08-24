const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClientProject = sequelize.define('client_projects', {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    project_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'client_id'
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(50),
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
    contract_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    work_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    project_documents: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'client_projects'
  });

  return ClientProject;
};
