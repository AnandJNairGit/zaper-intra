// src/models/associations/communicationAssociations.js

/**
 * Communication and accommodation associations
 * Handles relationships between communication details and accommodations
 */
module.exports = (db) => {
  const { UserCommunicationDetails, StaffAccommodation } = db;

  // ===========================
  // COMMUNICATION & ACCOMMODATION ASSOCIATIONS
  // ===========================
  
  // UserCommunicationDetails -> StaffAccommodation (accommodation_id reference)
  UserCommunicationDetails.belongsTo(StaffAccommodation, { 
    foreignKey: 'accommodation_id', 
    as: 'accommodation' 
  });

  // StaffAccommodation -> UserCommunicationDetails (One-to-Many)
  StaffAccommodation.hasMany(UserCommunicationDetails, { 
    foreignKey: 'accommodation_id', 
    as: 'communicationDetails'
  });

  console.log('📞 Communication associations established');
};
