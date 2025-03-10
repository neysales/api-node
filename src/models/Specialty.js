const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define('Specialty', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nome'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'descricao'
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
      field: 'ativa'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_cadastro'
    }
  }, {
    tableName: 'especialidades',
    timestamps: false
  });

  Specialty.associate = function(models) {
    Specialty.belongsTo(models.Company, { foreignKey: 'empresa_id', as: 'empresa' });
    Specialty.hasMany(models.Attendant, { foreignKey: 'especialidade_id', as: 'atendentes' });
  };

  return Specialty;
};