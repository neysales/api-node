const { Company } = require('../models');
const { v4: uuidv4 } = require('uuid');

const checkEmpresa = async (req, res) => {
  try {
    console.log('Verificando empresa ativa...');
    const empresa = await Company.findOne({ where: { ativa: true } });
    console.log('Resultado da consulta:', empresa);
    if (empresa) {
      return res.json({ exists: true, chave_api: empresa.chaveApi });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error('Erro ao verificar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createEmpresa = async (req, res) => {
  try {
    const empresaExistente = await Company.findOne({ where: { ativa: true } });
    if (empresaExistente) {
      return res.status(409).json({ error: 'Já existe uma empresa ativa cadastrada' });
    }

    const novaEmpresa = await Company.create({
      nome: req.body.nome,
      atividade: req.body.atividade,
      responsavel: req.body.responsavel,
      enderecoRua: req.body.enderecoRua,
      enderecoCidade: req.body.enderecoCidade,
      enderecoEstado: req.body.enderecoEstado,
      enderecoBairro: req.body.enderecoBairro,
      enderecoCep: req.body.enderecoCep,
      enderecoPais: req.body.enderecoPais,
      enderecoComplemento: req.body.enderecoComplemento,
      enderecoNumero: req.body.enderecoNumero,
      telefoneFixo: req.body.telefoneFixo,
      telefoneCelular: req.body.telefoneCelular,
      telefoneWhatsapp: req.body.telefoneWhatsapp,
      email: req.body.email,
      ativa: true,
      dataCadastro: new Date(),
      chaveApi: uuidv4(),
      aiProvider: req.body.aiProvider || 'openai',
      aiApiKey: req.body.aiApiKey,
      aiModel: req.body.aiModel || 'gpt-3.5-turbo'
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
