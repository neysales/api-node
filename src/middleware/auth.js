const { Empresa } = require('../models');

const authMiddleware = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Chave API não fornecida' });
  }

  try {
    const empresa = await Empresa.findOne({ 
      where: { 
        chave_api: apiKey,
        ativa: true 
      } 
    });

    if (!empresa) {
      return res.status(401).json({ error: 'Chave API inválida' });
    }

    req.empresa = empresa;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware;