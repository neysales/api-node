const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'name' 
    },
    activity: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    responsible: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    address_street: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_state: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_neighborhood: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_zip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_country: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Brasil'
    },
    address_complement: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_landline: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_mobile: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_whatsapp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    api_key: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '00000000-0000-0000-0000-000000000000'
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
    tableName: 'companies',
    timestamps: false
  });

  Company.associate = function(models) {
    Company.hasMany(models.Attendant, {
      foreignKey: 'company_id',
      as: 'attendants'
    });
    Company.hasMany(models.Specialty, {
      foreignKey: 'company_id',
      as: 'specialties'
    });
    Company.hasMany(models.Appointment, {
      foreignKey: 'company_id',
      as: 'appointments'
    });
    Company.hasOne(models.Config, {
      foreignKey: 'company_id',
      as: 'config'
    });
    Company.belongsToMany(models.Client, {
      through: 'clients_companies',
      foreignKey: 'company_id',
      otherKey: 'client_id',
      as: 'clients'
    });
  };

  return Company;
};
