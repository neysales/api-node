const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define('Specialty', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'Description'
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
    tableName: 'Specialties',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return Specialty;
};