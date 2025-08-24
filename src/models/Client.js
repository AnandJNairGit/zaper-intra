const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('clients', {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    client_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    countries: {
      type: DataTypes.JSON,
      allowNull: true
    },
    industry_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    billingtype: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    primary_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_staff: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    total_licences: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cost_of_licence: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    no_of_projects: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    no_of_locations: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    client_logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    excel_parser: {
      type: DataTypes.STRING(155),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'clients'
  });

  return Client;
};
