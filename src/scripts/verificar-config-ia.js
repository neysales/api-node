/**
 * Script para verificar as configurações de IA na tabela config
 */

const { sequelize } = require('../models');
const AIConfigService = require('../services/aiConfigService');

async function verificarConfigIA() {
  try {
    console.log('Verificando empresa com chave API: df739816-3ac6-4994-99bc-348df6b298bd');
    
    const empresas = await sequelize.query(
      `SELECT id, nome, chave_api FROM empresas WHERE chave_api = $1`,
      {
        bind: ['df739816-3ac6-4994-99bc-348df6b298bd'],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (empresas.length === 0) {
      console.log('Empresa não encontrada');
      return;
    }
    
    const empresa = empresas[0];
    console.log(`Empresa encontrada: ${empresa.id} (${empresa.nome})`);
    
    // Verificar configurações na tabela config
    console.log('\nVerificando configurações na tabela config:');
    const configsQuery = await sequelize.query(
      `SELECT id, empresa_id, ai_provider, ai_api_key, ai_model FROM config WHERE empresa_id = $1`,
      {
        bind: [empresa.id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (configsQuery.length === 0) {
      console.log('Nenhuma configuração encontrada na tabela config');
    } else {
      console.log('Configurações encontradas:', JSON.stringify(configsQuery, null, 2));
    }
    
    // Verificar usando o serviço AIConfigService
    console.log('\nVerificando usando AIConfigService:');
    const aiConfig = await AIConfigService.getAIConfigForEmpresa(empresa.id);
    console.log('Configuração retornada pelo serviço:', JSON.stringify(aiConfig, null, 2));
    
    // Verificar variáveis de ambiente
    console.log('\nVerificando variáveis de ambiente:');
    console.log(`AI_PROVIDER: ${process.env.AI_PROVIDER || 'Não definido'}`);
    console.log(`AI_API_KEY: ${process.env.AI_API_KEY ? '******' : 'Não definido'}`);
    console.log(`AI_MODEL: ${process.env.AI_MODEL || 'Não definido'}`);
    
  } catch (error) {
    console.error('Erro ao verificar configurações de IA:', error);
  } finally {
    process.exit(0);
  }
}

// Executar verificação
verificarConfigIA();
