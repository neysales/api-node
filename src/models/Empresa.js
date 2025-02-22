const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atividade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    responsavel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone_celular: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chave_api: {
      type: DataTypes.STRING,
      unique: true
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'empresas'
  });

  return Empresa;
};
