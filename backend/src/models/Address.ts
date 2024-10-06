// backend/src/models/Address.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';
import User from './User';

interface AddressAttributes {
  id: number;
  userId: number;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  homeAddress: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public userId!: number;
  public companyAddress!: string;
  public companyCity!: string;
  public companyState!: string;
  public companyZip!: string;
  public homeAddress!: string;
  public homeCity!: string;
  public homeState!: string;
  public homeZip!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: false, 
      unique: true // Remove if multiple addresses per user are needed
    },
    companyAddress: { type: DataTypes.STRING, allowNull: false },
    companyCity: { type: DataTypes.STRING, allowNull: false },
    companyState: { type: DataTypes.STRING, allowNull: false },
    companyZip: { 
      type: DataTypes.STRING(6), 
      allowNull: false, 
      validate: { 
        len: [6, 6], 
        isNumeric: true 
      } 
    },
    homeAddress: { type: DataTypes.STRING, allowNull: false },
    homeCity: { type: DataTypes.STRING, allowNull: false },
    homeState: { type: DataTypes.STRING, allowNull: false },
    homeZip: { 
      type: DataTypes.STRING(6), 
      allowNull: false, 
      validate: { 
        len: [6, 6], 
        isNumeric: true 
      } 
    },
  },
  {
    sequelize,
    tableName: 'addresses',
  }
);

// Define association is done in association.ts

export default Address;
