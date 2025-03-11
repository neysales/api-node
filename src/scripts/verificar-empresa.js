/**
 * Script para verificar as configurações de IA da empresa
 */

const { sequelize } = require('../models');

async function verificarEmpresa() {
  try {
    console.log('Verificando empresa com chave API: df739816-3ac6-4994-99bc-348df6b298bd');
    
    const empresas = await sequelize.query(
      `SELECT id, nome, chave_api, ai_provider, ai_api_key, ai_model FROM empresas WHERE chave_api = $1`,
      {
        bind: ['df739816-3ac6-4994-99bc-348df6b298bd'],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('Empresas encontradas:', JSON.stringify(empresas, null, 2));
    
    // Verificar configurações de IA
    if (empresas.length > 0) {
      const empresa = empresas[0];
      console.log(`\nVerificando configurações de IA para empresa ${empresa.id} (${empresa.nome}):`);
      console.log(`- Provedor: ${empresa.ai_provider || 'Não configurado'}`);
      console.log(`- Chave API: ${empresa.ai_api_key ? '******' : 'Não configurada'}`);
      console.log(`- Modelo: ${empresa.ai_model || 'Não configurado'}`);
    }
  } catch (error) {
    console.error('Erro ao verificar empresa:', error);
  } finally {
    process.exit(0);
  }
}

// Executar verificação
verificarEmpresa();
