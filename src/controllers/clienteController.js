const { Cliente, Empresa } = require('../models');
const bcrypt = require('bcrypt');

const getAllClientes = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { chave_api: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const clientes = await Cliente.findAll({
      where: { empresa_id: empresa.id }
    });
    
    return res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { chave_api: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Cliente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: empresa.id
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createCliente = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { chave_api: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);
    
    const novoCliente = await Cliente.create({
      ...req.body,
      empresa_id: empresa.id,
      senha: senhaCriptografada,
      data_cadastro: new Date()
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateCliente = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { chave_api: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Cliente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: empresa.id
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10);
    }

    await cliente.update(req.body);
    return res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { chave_api: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Cliente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: empresa.id
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await cliente.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};
