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

  // Client associations
  Client.hasMany(ClientUser, { 
    foreignKey: 'client_id', 
    as: 'clientUsers',
    onDelete: 'CASCADE'
  });
  
  Client.hasMany(ClientProject, { 
    foreignKey: 'client_id', 
    as: 'clientProjects',
    onDelete: 'CASCADE'
  });

  Client.hasMany(ClientRole, { 
    foreignKey: 'client_id', 
    as: 'clientRoles',
    onDelete: 'CASCADE'
  });

  Client.hasMany(ClientJobProfile, { 
    foreignKey: 'client_id', 
    as: 'clientJobProfiles',
    onDelete: 'CASCADE'
  });

  // ClientJobProfile associations
  ClientJobProfile.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  ClientJobProfile.hasMany(UserJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'userJobProfiles',
    onDelete: 'CASCADE'
  });

  // ClientUser associations
  ClientUser.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  ClientUser.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });
  
  ClientUser.belongsTo(ClientRole, { 
    foreignKey: 'role_id', 
    as: 'role' 
  });

  // ClientRole associations
  ClientRole.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });

  ClientRole.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  ClientRole.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  ClientRole.hasMany(ClientUser, { 
    foreignKey: 'role_id', 
    as: 'clientUsers',
    onDelete: 'CASCADE'
  });

  // User associations
  User.hasMany(ClientUser, { 
    foreignKey: 'user_id', 
    as: 'clientAssignments',
    onDelete: 'CASCADE'
  });

  User.hasMany(UserPhoto, { 
    foreignKey: 'user_id', 
    as: 'photos',
    onDelete: 'CASCADE'
  });

  User.hasMany(UserSalary, { 
    foreignKey: 'user_id', 
    as: 'salaries',
    onDelete: 'CASCADE'
  });

  User.hasMany(UserJobProfile, { 
    foreignKey: 'user_id', 
    as: 'jobProfiles',
    onDelete: 'CASCADE'
  });

  User.hasMany(UserNotificationToken, { 
    foreignKey: 'user_id', 
    as: 'notificationTokens',
    onDelete: 'CASCADE'
  });

  // UserJobProfile associations
  UserJobProfile.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  UserJobProfile.belongsTo(ClientJobProfile, { 
    foreignKey: 'profile_id', 
    as: 'jobProfile' 
  });

  UserJobProfile.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  UserJobProfile.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // UserNotificationToken associations
  UserNotificationToken.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // UserPhoto associations
  UserPhoto.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  UserPhoto.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  UserPhoto.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // UserSalary associations
  UserSalary.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  UserSalary.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });

  UserSalary.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });

  // ClientProject associations (existing)
  ClientProject.belongsTo(Client, { 
    foreignKey: 'client_id', 
    as: 'client' 
  });
  
  ClientProject.belongsTo(User, { 
    foreignKey: 'created_by', 
    as: 'creator' 
  });
  
  ClientProject.belongsTo(User, { 
    foreignKey: 'updated_by', 
    as: 'updater' 
  });
};
