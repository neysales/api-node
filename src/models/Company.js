const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nome'
    },
    atividade: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'atividade'
    },
    responsavel: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'responsavel'
    },
    enderecoRua: {
      type: DataTypes.TEXT,
      field: 'endereco_rua'
    },
    enderecoCidade: {
      type: DataTypes.TEXT,
      field: 'endereco_cidade'
    },
    enderecoEstado: {
      type: DataTypes.TEXT,
      field: 'endereco_estado'
    },
    enderecoBairro: {
      type: DataTypes.TEXT,
      field: 'endereco_bairro'
    },
    enderecoCep: {
      type: DataTypes.TEXT,
      field: 'endereco_cep'
    },
    enderecoPais: {
      type: DataTypes.TEXT,
      field: 'endereco_pais'
    },
    enderecoComplemento: {
      type: DataTypes.TEXT,
      field: 'endereco_complemento'
    },
    enderecoNumero: {
      type: DataTypes.TEXT,
      field: 'endereco_numero'
    },
    telefoneFixo: {
      type: DataTypes.TEXT,
      field: 'telefone_fixo'
    },
    telefoneCelular: {
      type: DataTypes.TEXT,
      field: 'telefone_celular'
    },
    telefoneWhatsapp: {
      type: DataTypes.TEXT,
      field: 'telefone_whatsapp'
    },
    email: {
      type: DataTypes.STRING(255),
      field: 'email'
    },
    chaveApi: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: '00000000-0000-0000-0000-000000000000',
      field: 'chave_api'
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'ativa'
    },
    dataCadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_cadastro'
    },
    // Campos para configuração da IA
    aiProvider: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ai_provider',
      defaultValue: 'openai',
      validate: {
        isIn: [['openai', 'anthropic', 'google']]
      }
    },
    aiApiKey: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ai_api_key'
    },
    aiModel: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ai_model',
      defaultValue: 'gpt-3.5-turbo'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt'
    }
  }, {
    tableName: 'empresas',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return Company;
};
