const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nome'
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'telefone_celular'
    },
    email: {
      type: DataTypes.STRING(255),
      field: 'email'
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_cadastro'
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'empresa_id',
      references: {
        model: 'empresas',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'ativo'
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
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  Customer.associate = function(models) {
    Customer.belongsTo(models.Company, { foreignKey: 'empresa_id', as: 'empresa' });
    Customer.hasMany(models.Appointment, { foreignKey: 'cliente_id', as: 'agendamentos' });
  };

  return Customer;
};