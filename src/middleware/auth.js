const { Sequelize } = require('sequelize');
const sequelize = require('../models').sequelize;
const { Company } = require('../models');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key not provided' });
  }

  try {
    const empresa = await Company.findOne({
      where: { 
        api_key: apiKey,
        active: true
      },
      attributes: [
        'id', 
        'name', 
        'email',
        'active'
      ]
    });

    if (!empresa) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Adiciona a empresa ao objeto req para uso nos controllers
    req.empresa = empresa;
    
    console.log('Company authenticated:', {
      id: empresa.id,
      name: empresa.name
    });
    
    next();
  } catch (error) {
    console.error('Error authenticating API key:', error);
    res.status(500).json({ error: 'Internal authentication error' });
  }
};

module.exports = { apiKeyAuth };