require('dotenv').config();
const { sequelize, Company } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function criarEmpresa() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se já existe uma empresa com a API key
    const apiKey = process.env.Authentication__ApiKey || uuidv4();
    const empresaExistente = await Company.findOne({ 
      where: { 
        api_key: apiKey
      } 
    });

    if (empresaExistente) {
      console.log('Empresa com esta API key já existe:', empresaExistente.name);
      console.log('ID da empresa:', empresaExistente.id);
      return;
    }

    // Criar uma nova empresa
    const companyId = uuidv4();
    const novaEmpresa = await Company.create({
      id: companyId,
      name: 'Empresa Teste',
      activity: 'Serviços',
      responsible: 'Administrador',
      phone_mobile: '(11) 99999-9999',
      email: 'admin@empresa.com',
      api_key: apiKey,
      active: true,
      registration_date: new Date()
    });

    console.log('Empresa criada com sucesso:', novaEmpresa.name);
    console.log('ID da empresa:', novaEmpresa.id);

    // Criar configuração inicial
    const configId = uuidv4();
    await sequelize.query(`
      INSERT INTO config (
        id,
        company_id,
        ai_provider,
        ai_api_key,
        ai_model,
        registration_date
      ) VALUES (
        '${configId}',
        '${companyId}',
        'openai',
        '${process.env.AI_API_KEY || ''}',
        '${process.env.AI_MODEL || 'gpt-3.5-turbo'}',
        CURRENT_TIMESTAMP
      );
    `);

    console.log('Configuração inicial criada com sucesso!');
    console.log('API Key da empresa:', apiKey);

  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    process.exit(1);
  }
}

criarEmpresa()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
