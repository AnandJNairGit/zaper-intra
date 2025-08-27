// src/models/associations/staffAssociations.js

/**
 * Staff service specific associations
 * Handles cross-model relationships for efficient staff data retrieval
 */
module.exports = (db) => {
  const { 
    ClientUser, 
    ClientRole, 
    ClientJobProfile,
    UserPhoto, 
    UserJobProfile, 
    UserSalary, 
    UserNotificationToken,
    UserCommunicationDetails
  } = db;

  // ===========================
  // STAFF CORE ASSOCIATIONS
  // ===========================
  
  // ClientUser -> ClientRole (Many-to-One)
  ClientUser.belongsTo(ClientRole, { 
    foreignKey: 'role_id', 
    as: 'role' 
  });

  // ClientRole -> ClientUsers (One-to-Many)
  ClientRole.hasMany(ClientUser, { 
    foreignKey: 'role_id', 
    as: 'clientUsers',
    onDelete: 'CASCADE'
  });

  // UserJobProfile -> ClientJobProfile (Many-to-One)
  UserJobProfile.belongsTo(ClientJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'jobProfile' 
  });

  // ClientJobProfile -> UserJobProfiles (One-to-Many)
  ClientJobProfile.hasMany(UserJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'userJobProfiles',
    onDelete: 'CASCADE'
  });

  // ===========================
  // SPECIAL CROSS-MODEL ASSOCIATIONS FOR STAFF SERVICE
  // ===========================
  
  // ClientUser -> UserPhoto (via user_id for face registration check)
  ClientUser.hasMany(UserPhoto, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'photos'
  });

  // ClientUser -> UserJobProfile (via user_id for job profile details)
  ClientUser.hasMany(UserJobProfile, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'jobProfiles'
  });

  // ClientUser -> UserSalary (via user_id for salary information)
  ClientUser.hasMany(UserSalary, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'salaries'
  });

  // ClientUser -> UserNotificationToken (via user_id for device information)
  ClientUser.hasMany(UserNotificationToken, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'notificationTokens'
  });

  // ClientUser -> UserCommunicationDetails (via user_id for communication info)
  ClientUser.hasMany(UserCommunicationDetails, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'communicationDetails'
  });

  console.log('👥 Staff service associations established');
};
