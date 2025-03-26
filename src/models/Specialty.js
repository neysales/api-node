const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define('Specialty', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'specialties',
    timestamps: false
  });

  Specialty.associate = function(models) {
    Specialty.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    
    Specialty.hasMany(models.Attendant, {
      foreignKey: 'specialty_id',
      as: 'attendants'
    });
  };

  return Specialty;
};