const { Sequelize } = require('sequelize');
const sequelize = require('../models').sequelize;
const { Company } = require('../models');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Chave de API não fornecida' });
  }

  try {
    // Usar parâmetros na consulta SQL para evitar injeção SQL
    const [companies] = await sequelize.query(
      `SELECT * FROM empresas WHERE chave_api = ? AND ativa = true LIMIT 1`,
      {
        replacements: [apiKey],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (companies.length === 0) {
      return res.status(401).json({ error: 'Chave de API inválida' });
    }

    req.company = companies[0];
    next();
  } catch (error) {
    console.error('Erro ao autenticar chave de API:', error);
    res.status(500).json({ error: 'Erro interno durante a autenticação' });
  }
};

module.exports = { apiKeyAuth };