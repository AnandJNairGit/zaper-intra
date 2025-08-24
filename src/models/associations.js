// src/models/associations.js
module.exports = (db) => {
  const { 
    Client, 
    ClientProject, 
    ClientUser, 
    ClientRole,
    ClientJobProfile,
    User, 
    UserPhoto, 
    UserSalary,
    UserJobProfile,
    UserNotificationToken
  } = db;

  // ===========================
  // CLIENT ASSOCIATIONS
  // ===========================
  
  // Client -> ClientUsers (One-to-Many)
  Client.hasMany(ClientUser, { 
    foreignKey: 'client_id', 
    as: 'clientUsers',
    onDelete: 'CASCADE'
  });
  
  // Client -> ClientProjects (One-to-Many)
  Client.hasMany(ClientProject, { 
    foreignKey: 'client_id', 
    as: 'clientProjects',
    onDelete: 'CASCADE'
  });

  // Client -> ClientRoles (One-to-Many)
  Client.hasMany(ClientRole, { 
    foreignKey: 'client_id', 
    as: 'clientRoles',
    onDelete: 'CASCADE'
  });

  // Client -> ClientJobProfiles (One-to-Many)
  Client.hasMany(ClientJobProfile, { 
    foreignKey: 'client_id', 
    as: 'clientJobProfiles',
    onDelete: 'CASCADE'
  });

  // ===========================
  // CLIENT USER ASSOCIATIONS
  // ===========================
  
  // ClientUser -> Client (Many-to-One)
  ClientUser.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  // ClientUser -> User (Many-to-One)
  ClientUser.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });
  
  // ClientUser -> ClientRole (Many-to-One)
  ClientUser.belongsTo(ClientRole, { 
    foreignKey: 'role_id', 
    as: 'role' 
  });

  // ClientUser -> User (created_by)
  ClientUser.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });
  
  // ClientUser -> User (updated_by)
  ClientUser.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ===========================
  // CLIENT PROJECT ASSOCIATIONS
  // ===========================
  
  // ClientProject -> Client (Many-to-One)
  ClientProject.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  // ClientProject -> User (created_by)
  ClientProject.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });
  
  // ClientProject -> User (updated_by)
  ClientProject.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ===========================
  // CLIENT ROLE ASSOCIATIONS
  // ===========================
  
  // ClientRole -> Client (Many-to-One)
  ClientRole.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  // ClientRole -> User (created_by)
  ClientRole.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  // ClientRole -> User (updated_by)
  ClientRole.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ClientRole -> ClientUsers (One-to-Many)
  ClientRole.hasMany(ClientUser, { 
    foreignKey: 'role_id', 
    as: 'clientUsers',
    onDelete: 'CASCADE'
  });

  // ===========================
  // CLIENT JOB PROFILE ASSOCIATIONS
  // ===========================
  
  // ClientJobProfile -> Client (Many-to-One)
  ClientJobProfile.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  // ClientJobProfile -> UserJobProfiles (One-to-Many)
  ClientJobProfile.hasMany(UserJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'userJobProfiles',
    onDelete: 'CASCADE'
  });

  // ===========================
  // USER ASSOCIATIONS
  // ===========================
  
  // User -> ClientUsers (One-to-Many)
  User.hasMany(ClientUser, { 
    foreignKey: 'user_id', 
    as: 'clientAssignments',
    onDelete: 'CASCADE'
  });

  // User -> ClientUsers (created_by - One-to-Many)
  User.hasMany(ClientUser, { 
    foreignKey: 'created_by', 
    as: 'createdClientUsers',
    onDelete: 'CASCADE'
  });

  // User -> ClientUsers (updated_by - One-to-Many)
  User.hasMany(ClientUser, { 
    foreignKey: 'updated_by', 
    as: 'updatedClientUsers',
    onDelete: 'CASCADE'
  });

  // User -> ClientProjects (created_by - One-to-Many)
  User.hasMany(ClientProject, { 
    foreignKey: 'created_by', 
    as: 'createdClientProjects',
    onDelete: 'CASCADE'
  });

  // User -> ClientProjects (updated_by - One-to-Many)
  User.hasMany(ClientProject, { 
    foreignKey: 'updated_by', 
    as: 'updatedClientProjects',
    onDelete: 'CASCADE'
  });

  // User -> ClientRoles (created_by - One-to-Many)
  User.hasMany(ClientRole, { 
    foreignKey: 'created_by', 
    as: 'createdClientRoles',
    onDelete: 'CASCADE'
  });

  // User -> ClientRoles (updated_by - One-to-Many)
  User.hasMany(ClientRole, { 
    foreignKey: 'updated_by', 
    as: 'updatedClientRoles',
    onDelete: 'CASCADE'
  });

  // User -> UserPhotos (One-to-Many)
  User.hasMany(UserPhoto, { 
    foreignKey: 'user_id', 
    as: 'photos',
    onDelete: 'CASCADE'
  });

  // User -> UserPhotos (created_by - One-to-Many)
  User.hasMany(UserPhoto, { 
    foreignKey: 'created_by', 
    as: 'createdUserPhotos',
    onDelete: 'CASCADE'
  });

  // User -> UserPhotos (updated_by - One-to-Many)
  User.hasMany(UserPhoto, { 
    foreignKey: 'updated_by', 
    as: 'updatedUserPhotos',
    onDelete: 'CASCADE'
  });

  // User -> UserSalary (One-to-Many)
  User.hasMany(UserSalary, { 
    foreignKey: 'user_id', 
    as: 'salaries',
    onDelete: 'CASCADE'
  });

  // User -> UserSalary (created_by - One-to-Many)
  User.hasMany(UserSalary, { 
    foreignKey: 'created_by', 
    as: 'createdUserSalaries',
    onDelete: 'CASCADE'
  });

  // User -> UserSalary (updated_by - One-to-Many)
  User.hasMany(UserSalary, { 
    foreignKey: 'updated_by', 
    as: 'updatedUserSalaries',
    onDelete: 'CASCADE'
  });

  // User -> UserJobProfiles (One-to-Many)
  User.hasMany(UserJobProfile, { 
    foreignKey: 'user_id', 
    as: 'jobProfiles',
    onDelete: 'CASCADE'
  });

  // User -> UserJobProfiles (created_by - One-to-Many)
  User.hasMany(UserJobProfile, { 
    foreignKey: 'created_by', 
    as: 'createdUserJobProfiles',
    onDelete: 'CASCADE'
  });

  // User -> UserJobProfiles (updated_by - One-to-Many)
  User.hasMany(UserJobProfile, { 
    foreignKey: 'updated_by', 
    as: 'updatedUserJobProfiles',
    onDelete: 'CASCADE'
  });

  // User -> UserNotificationTokens (One-to-Many)
  User.hasMany(UserNotificationToken, { 
    foreignKey: 'user_id', 
    as: 'notificationTokens',
    onDelete: 'CASCADE'
  });

  // ===========================
  // USER PHOTO ASSOCIATIONS
  // ===========================
  
  // UserPhoto -> User (Many-to-One)
  UserPhoto.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserPhoto -> User (created_by)
  UserPhoto.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  // UserPhoto -> User (updated_by)
  UserPhoto.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ===========================
  // USER SALARY ASSOCIATIONS
  // ===========================
  
  // UserSalary -> User (Many-to-One)
  UserSalary.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserSalary -> User (created_by)
  UserSalary.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  // UserSalary -> User (updated_by)
  UserSalary.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ===========================
  // USER JOB PROFILE ASSOCIATIONS
  // ===========================
  
  // UserJobProfile -> User (Many-to-One)
  UserJobProfile.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserJobProfile -> ClientJobProfile (Many-to-One)
  UserJobProfile.belongsTo(ClientJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'jobProfile' 
  });

  // UserJobProfile -> User (created_by)
  UserJobProfile.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  // UserJobProfile -> User (updated_by)
  UserJobProfile.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ===========================
  // USER NOTIFICATION TOKEN ASSOCIATIONS
  // ===========================
  
  // UserNotificationToken -> User (Many-to-One)
  UserNotificationToken.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // ===========================
  // SPECIAL ASSOCIATIONS FOR STAFF SERVICE
  // ===========================
  
  // ClientUser -> UserPhoto (for face registration check)
  // This creates a virtual association through user_id
  ClientUser.hasMany(UserPhoto, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'photos'
  });

  // ClientUser -> UserJobProfile (for job profile details)
  ClientUser.hasMany(UserJobProfile, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'jobProfiles'
  });

  // ClientUser -> UserSalary (for salary information)
  ClientUser.hasMany(UserSalary, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'salaries'
  });

  // ClientUser -> UserNotificationToken (for device information)
  ClientUser.hasMany(UserNotificationToken, { 
    foreignKey: 'user_id',
    sourceKey: 'user_id', 
    as: 'notificationTokens'
  });
};
