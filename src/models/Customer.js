const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  MobileNumber: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(255)
  },
  RegistrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'Id'
    }
  }
}, {
  tableName: 'Customers',
  timestamps: false
});

module.exports = Customer;