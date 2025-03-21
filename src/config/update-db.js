/**
 * Script para atualizar a tabela config no banco de dados
 * Adiciona campos relacionados à IA para suportar o modelo multi-tenant
 */

require('dotenv').config();
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
  host: '185.217.127.77',
  port: 5432,
  database: 'agendero',
  user: 'postgres',
  password: '984011c5ca123ee9060092a2af946367'
});

async function updateConfigTable() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando atualização da tabela config...');
    
    // Iniciar transação
    await client.query('BEGIN');
    
    // Verificar e adicionar coluna ai_provider
    const checkAiProvider = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='config' AND column_name='ai_provider'
    `);
    
    if (checkAiProvider.rows.length === 0) {
      console.log('Adicionando coluna ai_provider...');
      await client.query(`
        ALTER TABLE public.config 
        ADD COLUMN ai_provider TEXT COLLATE pg_catalog."default" DEFAULT 'openai'
      `);
    } else {
      console.log('Coluna ai_provider já existe.');
    }
    
    // Verificar e adicionar coluna ai_api_key
    const checkAiApiKey = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='config' AND column_name='ai_api_key'
    `);
    
    if (checkAiApiKey.rows.length === 0) {
      console.log('Adicionando coluna ai_api_key...');
      await client.query(`
        ALTER TABLE public.config 
        ADD COLUMN ai_api_key TEXT COLLATE pg_catalog."default"
      `);
    } else {
      console.log('Coluna ai_api_key já existe.');
    }
    
    // Verificar e adicionar coluna ai_model
    const checkAiModel = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='config' AND column_name='ai_model'
    `);
    
    if (checkAiModel.rows.length === 0) {
      console.log('Adicionando coluna ai_model...');
      await client.query(`
        ALTER TABLE public.config 
        ADD COLUMN ai_model TEXT COLLATE pg_catalog."default" DEFAULT 'gpt-3.5-turbo'
      `);
    } else {
      console.log('Coluna ai_model já existe.');
    }
    
    // Atualizar configurações existentes com valores padrão
    console.log('Atualizando registros existentes com valores padrão...');
    await client.query(`
      UPDATE public.config
      SET 
          ai_provider = COALESCE(ai_provider, 'openai'),
          ai_model = COALESCE(ai_model, 'gpt-3.5-turbo')
    `);
    
    // Confirmar transação
    await client.query('COMMIT');
    
    // Exibir as colunas da tabela para verificação
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'config' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstrutura atual da tabela config:');
    columns.rows.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });
    
    console.log('\nAtualização concluída com sucesso!');
    
  } catch (error) {
    // Reverter em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar a tabela config:', error);
  } finally {
    // Liberar o cliente
    client.release();
    // Encerrar o pool de conexões
    await pool.end();
  }
}

// Executar a função de atualização
updateConfigTable();
