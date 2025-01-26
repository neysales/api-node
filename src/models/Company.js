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
  mobileNumber: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'MobileNumber'
  },
  email: {
    type: DataTypes.TEXT,
    field: 'Email'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'IsActive'
  },
  apiKey: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'ApiKey'
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
  registrationDate: {
    type: DataTypes.DATE,
    field: 'RegistrationDate'
  },
  logo: {
    type: DataTypes.TEXT,
    field: 'Logo'
  }
}, {
  tableName: 'Companies',
  timestamps: false // Desativa created_at e updated_at
});

module.exports = Company;
