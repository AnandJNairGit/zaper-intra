module.exports = (db) => {
  const { 
    Client, 
    ClientProject, 
    ClientUser, 
    ClientRole,
    User, 
    UserPhoto, 
    UserSalary 
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

  // ClientProject associations (from before)
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
