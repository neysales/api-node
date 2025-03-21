const { Client, Company } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getAllClientes = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const clientes = await Client.findAll({
      where: { company_id: empresa.id }
    });
    
    return res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Client.findOne({
      where: { 
        id: req.params.id,
        company_id: empresa.id
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
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const novoCliente = await Client.create({
      id: uuidv4(),
      name: req.body.name,
      cpf_cnpj: req.body.cpf_cnpj,
      birth_date: req.body.birth_date,
      phone_mobile: req.body.phone_mobile,
      email: req.body.email,
      address_street: req.body.address_street,
      address_city: req.body.address_city,
      address_state: req.body.address_state,
      address_neighborhood: req.body.address_neighborhood,
      address_zip: req.body.address_zip,
      address_country: req.body.address_country,
      address_complement: req.body.address_complement,
      address_number: req.body.address_number,
      notes: req.body.notes,
      password: req.body.password,
      active: req.body.active !== undefined ? req.body.active : true,
      registration_date: new Date()
    });

    // Criar relação cliente-empresa
    await sequelize.query(`
      INSERT INTO clients_companies (client_id, company_id, registration_date)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `, {
      bind: [novoCliente.id, empresa.id],
      type: sequelize.QueryTypes.INSERT
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateCliente = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Client.findOne({
      where: { 
        id: req.params.id,
        company_id: empresa.id
      }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await cliente.update({
      name: req.body.name || cliente.name,
      cpf_cnpj: req.body.cpf_cnpj || cliente.cpf_cnpj,
      birth_date: req.body.birth_date || cliente.birth_date,
      phone_mobile: req.body.phone_mobile || cliente.phone_mobile,
      email: req.body.email || cliente.email,
      address_street: req.body.address_street || cliente.address_street,
      address_city: req.body.address_city || cliente.address_city,
      address_state: req.body.address_state || cliente.address_state,
      address_neighborhood: req.body.address_neighborhood || cliente.address_neighborhood,
      address_zip: req.body.address_zip || cliente.address_zip,
      address_country: req.body.address_country || cliente.address_country,
      address_complement: req.body.address_complement || cliente.address_complement,
      address_number: req.body.address_number || cliente.address_number,
      notes: req.body.notes || cliente.notes,
      password: req.body.password || cliente.password,
      active: req.body.active !== undefined ? req.body.active : cliente.active
    });
    
    return res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const empresa = await Company.findOne({ where: { api_key: req.headers['x-api-key'] } });
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não autorizada' });
    }

    const cliente = await Client.findOne({
      where: { 
        id: req.params.id,
        company_id: empresa.id
      }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Remover relação cliente-empresa primeiro
    await sequelize.query(`
      DELETE FROM clients_companies 
      WHERE client_id = $1 AND company_id = $2
    `, {
      bind: [cliente.id, empresa.id],
      type: sequelize.QueryTypes.DELETE
    });
    
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
