const { Customer, Company } = require('../models');

const getAllClientes = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { apiKey: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const clientes = await Customer.findAll({
      where: { companyId: empresa.id }
    });
    
    return res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { apiKey: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Customer.findOne({
      where: { 
        id: req.params.id,
        companyId: empresa.id
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
    const empresa = await Company.findOne({ where: { apiKey: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const novoCliente = await Customer.create({
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      companyId: empresa.id,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateCliente = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { apiKey: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Customer.findOne({
      where: { 
        id: req.params.id,
        companyId: empresa.id
      }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await cliente.update({
      name: req.body.name || cliente.name,
      mobileNumber: req.body.mobileNumber || cliente.mobileNumber,
      email: req.body.email || cliente.email,
      isActive: req.body.isActive !== undefined ? req.body.isActive : cliente.isActive
    });
    
    return res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { apiKey: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Customer.findOne({
      where: { 
        id: req.params.id,
        companyId: empresa.id
      }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await cliente.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
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
