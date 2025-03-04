const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'Id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Name'
    },
    mobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'MobileNumber'
    },
    email: {
      type: DataTypes.STRING(255),
      field: 'Email'
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'RegistrationDate'
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'CompanyId',
      references: {
        model: 'Companies',
        key: 'Id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'IsActive'
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
    tableName: 'Customers',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return Customer;
};