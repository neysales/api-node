/**
 * Script para adicionar campos de IA à tabela empresas
 */

const { sequelize } = require('../models');

async function adicionarCamposAI() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Verificar se as colunas já existem
    const colunas = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'empresas' 
       AND column_name IN ('ai_provider', 'ai_api_key', 'ai_model', 'createdAt', 'updatedAt')`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Colunas encontradas:', colunas);
    
    const colunasExistentes = colunas.map(col => col.column_name);
    
    // Adicionar colunas que não existem
    if (!colunasExistentes.includes('ai_provider')) {
      console.log('Adicionando coluna ai_provider...');
      await sequelize.query(
        `ALTER TABLE empresas ADD COLUMN ai_provider TEXT DEFAULT 'openai'`
      );
    } else {
      console.log('Coluna ai_provider já existe.');
    }
    
    if (!colunasExistentes.includes('ai_api_key')) {
      console.log('Adicionando coluna ai_api_key...');
      await sequelize.query(
        `ALTER TABLE empresas ADD COLUMN ai_api_key TEXT DEFAULT ''`
      );
    } else {
      console.log('Coluna ai_api_key já existe.');
    }
    
    if (!colunasExistentes.includes('ai_model')) {
      console.log('Adicionando coluna ai_model...');
      await sequelize.query(
        `ALTER TABLE empresas ADD COLUMN ai_model TEXT DEFAULT 'gpt-3.5-turbo'`
      );
    } else {
      console.log('Coluna ai_model já existe.');
    }
    
    if (!colunasExistentes.includes('createdAt')) {
      console.log('Adicionando coluna createdAt...');
      await sequelize.query(
        `ALTER TABLE empresas ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
      );
    } else {
      console.log('Coluna createdAt já existe.');
    }
    
    if (!colunasExistentes.includes('updatedAt')) {
      console.log('Adicionando coluna updatedAt...');
      await sequelize.query(
        `ALTER TABLE empresas ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
      );
    } else {
      console.log('Coluna updatedAt já existe.');
    }
    
    console.log('Processo concluído!');
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  } catch (error) {
    console.error('Erro ao adicionar colunas:', error);
  }
}

// Executar a função
adicionarCamposAI();
