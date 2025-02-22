const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key não fornecida' });
  }

  try {
    // Verifica se a API key corresponde à do arquivo de configuração
    if (apiKey === process.env.Authentication__ApiKey) {
      return next();
    }

    // Se não for a API key do arquivo de configuração, procura no banco de dados
    const company = await Company.findOne({
      where: {
        ApiKey: apiKey,
        IsActive: true
      }
    });

    if (!company) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    req.company = company;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao validar API Key' });
  }
};

const jwtAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { apiKeyAuth, jwtAuth };