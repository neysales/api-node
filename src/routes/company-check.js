const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

/**
 * Rota para verificar se existe alguma empresa cadastrada
 */
router.get('/', async (req, res) => {
  try {
    console.log('Verificando empresas ativas...');
    
    // Usar SQL direto para evitar problemas com o modelo
    const [empresas] = await sequelize.query(
      `SELECT id, nome, chave_api FROM empresas WHERE ativa = true LIMIT 1`
    );

    const empresaExiste = empresas.length > 0;
    console.log('Resultado da verificação:', empresaExiste ? 'Empresa encontrada' : 'Nenhuma empresa encontrada');
    
    res.json({
      exists: empresaExiste,
      apiKey: empresaExiste ? empresas[0].chave_api : null,
      nome: empresaExiste ? empresas[0].nome : null
    });
  } catch (error) {
    console.error('Erro ao verificar empresas:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Erro ao verificar empresas: ' + error.message });
  }
});

module.exports = router;
