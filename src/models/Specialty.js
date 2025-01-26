const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Specialty = sequelize.define('Specialty', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  Name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'Specialties'
});

module.exports = Specialty;