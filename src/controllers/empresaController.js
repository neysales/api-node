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

const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await Company.findAll({
      attributes: { 
        exclude: ['api_key'] // Não retorna a api_key por segurança
      }
    });
    
    return res.json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getEmpresaById = async (req, res) => {
  try {
    const empresa = await Company.findOne({
      where: { id: req.params.id },
      attributes: { 
        exclude: ['api_key']
      }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    return res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createEmpresa = async (req, res) => {
  try {
    const novaEmpresa = await Company.create({
      id: uuidv4(),
      name: req.body.name,
      activity: req.body.activity,
      responsible: req.body.responsible,
      address_street: req.body.address_street,
      address_city: req.body.address_city,
      address_state: req.body.address_state,
      address_neighborhood: req.body.address_neighborhood,
      address_zip: req.body.address_zip,
      address_country: req.body.address_country || 'Brasil',
      address_complement: req.body.address_complement,
      address_number: req.body.address_number,
      phone_landline: req.body.phone_landline,
      phone_mobile: req.body.phone_mobile,
      phone_whatsapp: req.body.phone_whatsapp,
      email: req.body.email,
      active: true,
      registration_date: new Date(),
      api_key: uuidv4()
    });

    // Remove api_key do retorno por segurança
    const { api_key, ...empresaSemApiKey } = novaEmpresa.toJSON();

    return res.status(201).json(empresaSemApiKey);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateEmpresa = async (req, res) => {
  try {
    const empresa = await Company.findOne({
      where: { api_key: req.headers['x-api-key'] }
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    await empresa.update({
      name: req.body.name || empresa.name,
      activity: req.body.activity || empresa.activity,
      responsible: req.body.responsible || empresa.responsible,
      address_street: req.body.address_street || empresa.address_street,
      address_city: req.body.address_city || empresa.address_city,
      address_state: req.body.address_state || empresa.address_state,
      address_neighborhood: req.body.address_neighborhood || empresa.address_neighborhood,
      address_zip: req.body.address_zip || empresa.address_zip,
      address_country: req.body.address_country || empresa.address_country,
      address_complement: req.body.address_complement || empresa.address_complement,
      address_number: req.body.address_number || empresa.address_number,
      phone_landline: req.body.phone_landline || empresa.phone_landline,
      phone_mobile: req.body.phone_mobile || empresa.phone_mobile,
      phone_whatsapp: req.body.phone_whatsapp || empresa.phone_whatsapp,
      email: req.body.email || empresa.email,
      active: req.body.active !== undefined ? req.body.active : empresa.active
    });

    // Remove api_key do retorno por segurança
    const { api_key, ...empresaAtualizada } = empresa.toJSON();
    
    return res.json(empresaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteEmpresa = async (req, res) => {
  try {
    const empresa = await Company.findOne({
      where: { api_key: req.headers['x-api-key'] }
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    await empresa.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const regenerateApiKey = async (req, res) => {
  try {
    const empresa = await Company.findOne({
      where: { api_key: req.headers['x-api-key'] }
    });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const newApiKey = uuidv4();
    await empresa.update({ api_key: newApiKey });

    return res.json({ 
      message: 'API Key regenerada com sucesso', 
      api_key: newApiKey 
    });
  } catch (error) {
    console.error('Erro ao regenerar API Key:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  checkEmpresa,
  getAllEmpresas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  regenerateApiKey
};
