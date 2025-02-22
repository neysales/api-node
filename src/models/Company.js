const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    field: 'Id'
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'Name'
  },
  activity: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'Activity'
  },
  responsible: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'Responsible'
  },
  addressStreet: {
    type: DataTypes.TEXT,
    field: 'Address_Street'
  },
  addressCity: {
    type: DataTypes.TEXT,
    field: 'Address_City'
  },
  addressState: {
    type: DataTypes.TEXT,
    field: 'Address_State'
  },
  addressPostalCode: {
    type: DataTypes.TEXT,
    field: 'Address_PostalCode'
  },
  addressCountry: {
    type: DataTypes.TEXT,
    field: 'Address_Country'
  },
  addressAdditionalInfo: {
    type: DataTypes.TEXT,
    field: 'Address_AdditionalInfo'
  },
  addressNumber: {
    type: DataTypes.TEXT,
    field: 'Address_Number'
  },
  phoneNumber: {
    type: DataTypes.TEXT,
    field: 'PhoneNumber'
  },
  mobileNumber: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'MobileNumber'
  },
  email: {
    type: DataTypes.TEXT,
    field: 'Email'
  },
  cnpj: {
    type: DataTypes.TEXT,
    field: 'CNPJ'
  },
  logo: {
    type: DataTypes.TEXT,
    field: 'Logo'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'IsActive'
  },
  apiKey: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    field: 'ApiKey'
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'RegistrationDate'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'CreatedAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'UpdatedAt'
  }
}, {
  tableName: 'Companies',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

module.exports = Company;
