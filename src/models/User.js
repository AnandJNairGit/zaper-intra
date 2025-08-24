const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(18),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    religion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    skills_and_proficiency: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    language_spoken: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    education: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emailid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    twofactorauthentication: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    profile_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    skill_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    zaper_skills: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    login_mode: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'users'
  });

  return User;
};
