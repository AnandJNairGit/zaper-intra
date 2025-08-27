// src/models/associations/userAssociations.js

/**
 * User-related associations
 * Handles all relationships originating from User model
 */
module.exports = (db) => {
  const { 
    User, 
    ClientUser, 
    UserPhoto, 
    UserSalary, 
    UserJobProfile, 
    UserNotificationToken,
    UserCommunicationDetails
  } = db;

  // ===========================
  // USER PRIMARY ASSOCIATIONS
  // ===========================
  
  // User -> ClientUsers (One-to-Many)
  User.hasMany(ClientUser, { 
    foreignKey: 'user_id', 
    as: 'clientAssignments',
    onDelete: 'CASCADE'
  });

  // User -> UserPhotos (One-to-Many)
  User.hasMany(UserPhoto, { 
    foreignKey: 'user_id', 
    as: 'photos',
    onDelete: 'CASCADE'
  });

  // User -> UserSalary (One-to-Many)
  User.hasMany(UserSalary, { 
    foreignKey: 'user_id', 
    as: 'salaries',
    onDelete: 'CASCADE'
  });

  // User -> UserJobProfiles (One-to-Many)
  User.hasMany(UserJobProfile, { 
    foreignKey: 'user_id', 
    as: 'jobProfiles',
    onDelete: 'CASCADE'
  });

  // User -> UserNotificationTokens (One-to-Many)
  User.hasMany(UserNotificationToken, { 
    foreignKey: 'user_id', 
    as: 'notificationTokens',
    onDelete: 'CASCADE'
  });

  // User -> UserCommunicationDetails (One-to-Many)
  User.hasMany(UserCommunicationDetails, { 
    foreignKey: 'user_id', 
    as: 'communicationDetails',
    onDelete: 'CASCADE'
  });

  // ===========================
  // REVERSE ASSOCIATIONS TO USER
  // ===========================
  
  // ClientUser -> User (Many-to-One)
  ClientUser.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserPhoto -> User (Many-to-One)
  UserPhoto.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserSalary -> User (Many-to-One)
  UserSalary.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserJobProfile -> User (Many-to-One)
  UserJobProfile.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserNotificationToken -> User (Many-to-One)
  UserNotificationToken.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserCommunicationDetails -> User (Many-to-One)
  UserCommunicationDetails.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  console.log('👤 User associations established');
};
