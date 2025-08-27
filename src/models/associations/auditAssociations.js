// src/models/associations/auditAssociations.js

/**
 * Audit and tracking associations
 * Handles created_by/updated_by relationships across all models
 */
module.exports = (db) => {
  const { 
    User, 
    ClientUser, 
    ClientProject, 
    ClientRole, 
    UserPhoto, 
    UserSalary, 
    UserJobProfile, 
    UserCommunicationDetails,
    StaffAccommodation
  } = db;

  // ===========================
  // CLIENT USER AUDIT ASSOCIATIONS
  // ===========================
  
  // ClientUser audit relationships
  ClientUser.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  ClientUser.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(ClientUser, { foreignKey: 'created_by', as: 'createdClientUsers', onDelete: 'CASCADE' });
  User.hasMany(ClientUser, { foreignKey: 'updated_by', as: 'updatedClientUsers', onDelete: 'CASCADE' });

  // ===========================
  // CLIENT PROJECT AUDIT ASSOCIATIONS
  // ===========================
  
  // ClientProject audit relationships
  ClientProject.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  ClientProject.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(ClientProject, { foreignKey: 'created_by', as: 'createdClientProjects', onDelete: 'CASCADE' });
  User.hasMany(ClientProject, { foreignKey: 'updated_by', as: 'updatedClientProjects', onDelete: 'CASCADE' });

  // ===========================
  // CLIENT ROLE AUDIT ASSOCIATIONS
  // ===========================
  
  // ClientRole audit relationships
  ClientRole.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  ClientRole.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(ClientRole, { foreignKey: 'created_by', as: 'createdClientRoles', onDelete: 'CASCADE' });
  User.hasMany(ClientRole, { foreignKey: 'updated_by', as: 'updatedClientRoles', onDelete: 'CASCADE' });

  // ===========================
  // USER PHOTO AUDIT ASSOCIATIONS
  // ===========================
  
  // UserPhoto audit relationships
  UserPhoto.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  UserPhoto.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(UserPhoto, { foreignKey: 'created_by', as: 'createdUserPhotos', onDelete: 'CASCADE' });
  User.hasMany(UserPhoto, { foreignKey: 'updated_by', as: 'updatedUserPhotos', onDelete: 'CASCADE' });

  // ===========================
  // USER SALARY AUDIT ASSOCIATIONS
  // ===========================
  
  // UserSalary audit relationships
  UserSalary.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  UserSalary.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(UserSalary, { foreignKey: 'created_by', as: 'createdUserSalaries', onDelete: 'CASCADE' });
  User.hasMany(UserSalary, { foreignKey: 'updated_by', as: 'updatedUserSalaries', onDelete: 'CASCADE' });

  // ===========================
  // USER JOB PROFILE AUDIT ASSOCIATIONS
  // ===========================
  
  // UserJobProfile audit relationships
  UserJobProfile.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  UserJobProfile.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(UserJobProfile, { foreignKey: 'created_by', as: 'createdUserJobProfiles', onDelete: 'CASCADE' });
  User.hasMany(UserJobProfile, { foreignKey: 'updated_by', as: 'updatedUserJobProfiles', onDelete: 'CASCADE' });

  // ===========================
  // USER COMMUNICATION DETAILS AUDIT ASSOCIATIONS
  // ===========================
  
  // UserCommunicationDetails audit relationships
  UserCommunicationDetails.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  UserCommunicationDetails.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(UserCommunicationDetails, { foreignKey: 'created_by', as: 'createdUserCommunicationDetails', onDelete: 'CASCADE' });
  User.hasMany(UserCommunicationDetails, { foreignKey: 'updated_by', as: 'updatedUserCommunicationDetails', onDelete: 'CASCADE' });

  // ===========================
  // STAFF ACCOMMODATION AUDIT ASSOCIATIONS
  // ===========================
  
  // StaffAccommodation audit relationships
  StaffAccommodation.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  StaffAccommodation.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  
  User.hasMany(StaffAccommodation, { foreignKey: 'created_by', as: 'createdStaffAccommodations', onDelete: 'CASCADE' });
  User.hasMany(StaffAccommodation, { foreignKey: 'updated_by', as: 'updatedStaffAccommodations', onDelete: 'CASCADE' });

  console.log('📋 Audit associations established');
};
