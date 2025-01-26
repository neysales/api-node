const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendant = sequelize.define('Attendant', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  SpecialtyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  MobileNumber: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  HiringDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Attendants'
});

module.exports = Attendant;