require('dotenv').config();
const { sequelize } = require('../models');

async function criarEmpresaSimples() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Usar SQL direto para evitar problemas com o modelo
    const apiKey = process.env.Authentication__ApiKey;
    
    // Verificar se já existe uma empresa com a API key
    const [empresas] = await sequelize.query(
      `SELECT id, nome FROM empresas WHERE chave_api = '${apiKey}'`
    );

    if (empresas.length > 0) {
      console.log('Empresa com esta API key já existe:', empresas[0].nome);
      console.log('ID da empresa:', empresas[0].id);
      process.exit(0);
    }

    // Inserir nova empresa
    const [resultado] = await sequelize.query(`
      INSERT INTO empresas (
        nome, 
        atividade, 
        responsavel, 
        telefone_celular, 
        chave_api, 
        ativa, 
        ai_provider, 
        ai_api_key, 
        ai_model,
        "createdAt",
        "updatedAt"
      ) VALUES (
        'Empresa Teste', 
        'Serviços', 
        'Administrador', 
        '(11) 99999-9999', 
        '${apiKey}', 
        true, 
        'openai', 
        '${process.env.AI_API_KEY || ''}', 
        '${process.env.AI_MODEL || 'gpt-3.5-turbo'}',
        NOW(),
        NOW()
      ) RETURNING id, nome;
    `);

    console.log('Empresa criada com sucesso!');
    console.log('ID da empresa:', resultado[0].id);
    console.log('Nome da empresa:', resultado[0].nome);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    process.exit(1);
  }
}

criarEmpresaSimples();
