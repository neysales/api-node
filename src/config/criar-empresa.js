require('dotenv').config();
const { sequelize, Company } = require('../models');

async function criarEmpresa() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se já existe uma empresa com a API key
    const apiKey = process.env.Authentication__ApiKey;
    const empresaExistente = await Company.findOne({ 
      where: { 
        chaveApi: apiKey
      } 
    });

    if (empresaExistente) {
      console.log('Empresa com esta API key já existe:', empresaExistente.nome);
      process.exit(0);
    }

    // Criar uma nova empresa
    const novaEmpresa = await Company.create({
      nome: 'Empresa Teste',
      atividade: 'Serviços',
      responsavel: 'Administrador',
      telefoneCelular: '(11) 99999-9999',
      chaveApi: apiKey,
      ativa: true,
      aiProvider: 'openai',
      aiApiKey: process.env.AI_API_KEY || '',
      aiModel: process.env.AI_MODEL || 'gpt-3.5-turbo'
    });

    console.log('Empresa criada com sucesso:', novaEmpresa.nome);
    console.log('ID da empresa:', novaEmpresa.id);
    console.log('API Key:', novaEmpresa.chaveApi);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    process.exit(1);
  }
}

criarEmpresa();
