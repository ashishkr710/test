// backend/src/models/association.ts

import Address from "./Address";
import User from "./User";

// Define association
User.hasOne(Address, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'address', // Alias for association
});

Address.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'user', // Alias for association
});
