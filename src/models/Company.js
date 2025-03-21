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
      allowNull: false
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
      type: DataTypes.STRING(150),
      allowNull: true
    },
    address_city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address_state: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    address_neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address_zip: {
      type: DataTypes.STRING(9),
      allowNull: true
    },
    address_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Brasil'
    },
    address_complement: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone_landline: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone_mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    phone_whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
