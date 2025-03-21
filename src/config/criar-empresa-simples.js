require('dotenv').config();
const { sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function criarEmpresaSimples() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    const apiKey = process.env.Authentication__ApiKey || uuidv4();
    
    // Verificar se já existe uma empresa com a API key
    const [companies] = await sequelize.query(
      `SELECT id, name FROM companies WHERE api_key = '${apiKey}'`
    );

    if (companies.length > 0) {
      console.log('Empresa com esta API key já existe:', companies[0].name);
      console.log('ID da empresa:', companies[0].id);
      return;
    }

    // Inserir nova empresa
    const companyId = uuidv4();
    const [result] = await sequelize.query(`
      INSERT INTO companies (
        id,
        name,
        activity,
        responsible,
        phone_mobile,
        email,
        api_key,
        active,
        registration_date
      ) VALUES (
        '${companyId}',
        'Empresa Teste',
        'Serviços',
        'Administrador',
        '(11) 99999-9999',
        'admin@empresa.com',
        '${apiKey}',
        true,
        CURRENT_TIMESTAMP
      ) RETURNING id, name;
    `);

    console.log('Empresa criada com sucesso!');
    console.log('ID da empresa:', result[0].id);
    console.log('Nome da empresa:', result[0].name);

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
    throw error;
  }
}

criarEmpresaSimples()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
