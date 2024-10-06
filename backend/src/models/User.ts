// backend/src/models/User.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import Address from './Address';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  appointmentLetter: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public profilePhoto!: string;
  public appointmentLetter!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public address?: Address; // Optional because of hasOne relationship
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    profilePhoto: { type: DataTypes.STRING, allowNull: false },
    appointmentLetter: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

// Define association is done in association.ts

export default User;
