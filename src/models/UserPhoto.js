const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPhoto = sequelize.define('user_photos', {
    photo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    photo_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
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
    photo_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    saved_to_vector: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    face_data: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    face_data_json: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'user_photos'
  });

  return UserPhoto;
};
