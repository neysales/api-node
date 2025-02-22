const { Empresa } = require('../models');
const { v4: uuidv4 } = require('uuid');

const checkEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { ativa: true } });
    if (empresa) {
      return res.json({ exists: true, chave_api: empresa.chave_api });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error('Erro ao verificar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createEmpresa = async (req, res) => {
  try {
    const empresaExistente = await Empresa.findOne({ where: { ativa: true } });
    if (empresaExistente) {
      return res.status(409).json({ error: 'Já existe uma empresa ativa cadastrada' });
    }

    const novaEmpresa = await Empresa.create({
      ...req.body,
      ativa: true,
      data_cadastro: new Date(),
      chave_api: uuidv4()
    });

    return res.status(201).json(novaEmpresa);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  checkEmpresa,
  createEmpresa
};
