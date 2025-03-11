/**
 * Script para atualizar a chave API da IA para a empresa
 */

const { sequelize } = require('../models');

async function atualizarChaveAPIIA() {
  try {
    console.log('Atualizando chave API da IA para a empresa...');
    
    // Chave de API de teste (substitua por uma chave válida em produção)
    const chaveAPITeste = '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';
    
    // ID da empresa
    const empresaId = '5bef7c12-0828-44ce-acf2-2a12578f8726';
    
    // Atualizar na tabela config
    const resultConfig = await sequelize.query(
      `UPDATE config SET ai_api_key = $1 WHERE empresa_id = $2 RETURNING id`,
      {
        bind: [chaveAPITeste, empresaId],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('Configuração atualizada:', resultConfig[1].rowCount > 0 ? 'Sim' : 'Não');
    
    // Atualizar também na tabela empresas como fallback
    const resultEmpresa = await sequelize.query(
      `UPDATE empresas SET ai_api_key = $1 WHERE id = $2 RETURNING id`,
      {
        bind: [chaveAPITeste, empresaId],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('Empresa atualizada:', resultEmpresa[1].rowCount > 0 ? 'Sim' : 'Não');
    
    console.log('Chave API da IA atualizada com sucesso!');
    
    // Verificar as configurações atualizadas
    const configAtualizada = await sequelize.query(
      `SELECT id, empresa_id, ai_provider, ai_api_key, ai_model FROM config WHERE empresa_id = $1`,
      {
        bind: [empresaId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('Configuração atualizada:', JSON.stringify(configAtualizada, null, 2));
    
  } catch (error) {
    console.error('Erro ao atualizar chave API da IA:', error);
  } finally {
    process.exit(0);
  }
}

// Executar atualização
atualizarChaveAPIIA();
