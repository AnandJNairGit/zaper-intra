// src/models/associations/clientAssociations.js

/**
 * Client-related associations
 * Handles all relationships originating from Client model
 */
module.exports = (db) => {
  const { Client, ClientUser, ClientProject, ClientRole, ClientJobProfile, StaffAccommodation } = db;

  // ===========================
  // CLIENT PRIMARY ASSOCIATIONS
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

  // Client -> StaffAccommodations (One-to-Many)
  Client.hasMany(StaffAccommodation, { 
    foreignKey: 'client_id', 
    as: 'staffAccommodations',
    onDelete: 'CASCADE'
  });

  // ===========================
  // REVERSE ASSOCIATIONS TO CLIENT
  // ===========================
  
  // ClientUser -> Client (Many-to-One)
  ClientUser.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  // ClientProject -> Client (Many-to-One)
  ClientProject.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  // ClientRole -> Client (Many-to-One)
  ClientRole.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  // ClientJobProfile -> Client (Many-to-One)
  ClientJobProfile.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  // StaffAccommodation -> Client (Many-to-One)
  StaffAccommodation.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  console.log('🏢 Client associations established');
};
