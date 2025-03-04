const { sequelize } = require('../config/sequelize');
const { Company } = require('../models');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key not provided' });
  }

  try {
    const company = await Company.findOne({ 
      where: { 
        apiKey: apiKey,
        isActive: true 
      } 
    });

    if (!company) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.company = company;
    next();
  } catch (error) {
    console.error('Error authenticating API key:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = { apiKeyAuth };