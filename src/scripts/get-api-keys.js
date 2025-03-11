/**
 * Script para listar as chaves de API das empresas cadastradas
 */

const { sequelize } = require('../models');

async function listarChavesAPI() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Consultar as empresas ativas e suas chaves de API
    const [empresas] = await sequelize.query(
      `SELECT id, nome, chave_api FROM empresas WHERE ativa = true LIMIT 5`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('\n=== EMPRESAS CADASTRADAS ===');
    if (empresas && empresas.length > 0) {
      empresas.forEach(empresa => {
        console.log(`ID: ${empresa.id}`);
        console.log(`Nome: ${empresa.nome}`);
        console.log(`Chave API: ${empresa.chave_api}`);
        console.log('----------------------------');
      });
    } else {
      console.log('Nenhuma empresa ativa encontrada.');
    }
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  } catch (error) {
    console.error('Erro ao listar chaves de API:', error);
  }
}

// Executar a função
listarChavesAPI();
