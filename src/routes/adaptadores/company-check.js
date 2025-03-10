const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

/**
 * Rota para verificar se existem empresas ativas
 * Esta rota não requer autenticação, pois é usada para verificar se há empresas cadastradas
 */
router.get('/', async (req, res) => {
  try {
    const [empresas] = await sequelize.query(
      `SELECT id, nome, chave_api FROM empresas WHERE ativa = true LIMIT 1`
    );
    
    if (empresas.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nenhuma empresa ativa encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Empresa ativa encontrada',
      company: {
        id: empresas[0].id,
        name: empresas[0].nome,
        apiKey: empresas[0].chave_api
      }
    });
  } catch (error) {
    console.error('Erro ao verificar empresas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao verificar empresas: ' + error.message 
    });
  }
});

module.exports = router;
