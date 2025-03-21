const { Attendant, Specialty } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getAllAtendentes = async (req, res) => {
  try {
    const atendentes = await Attendant.findAll({
      where: { company_id: req.empresa.id },
      include: [{
        model: Specialty,
        as: 'specialty',
        attributes: ['name', 'description']
      }]
    });
    
    return res.json(atendentes);
  } catch (error) {
    console.error('Erro ao buscar atendentes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getAtendenteById = async (req, res) => {
  try {
    const atendente = await Attendant.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      },
      include: [{
        model: Specialty,
        as: 'specialty',
        attributes: ['name', 'description']
      }]
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    return res.json(atendente);
  } catch (error) {
    console.error('Erro ao buscar atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createAtendente = async (req, res) => {
  try {
    const especialidade = await Specialty.findOne({
      where: { 
        id: req.body.specialty_id,
        company_id: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    const novoAtendente = await Attendant.create({
      id: uuidv4(),
      name: req.body.name,
      specialty_id: req.body.specialty_id,
      company_id: req.empresa.id,
      phone_mobile: req.body.phone_mobile,
      email: req.body.email,
      hiring_date: req.body.hiring_date || new Date(),
      administrator: req.body.administrator || false,
      active: req.body.active !== undefined ? req.body.active : true,
      registration_date: new Date()
    });

    return res.status(201).json(novoAtendente);
  } catch (error) {
    console.error('Erro ao criar atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateAtendente = async (req, res) => {
  try {
    const atendente = await Attendant.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }
    
    if (req.body.specialty_id) {
      const especialidade = await Specialty.findOne({
        where: { 
          id: req.body.specialty_id,
          company_id: req.empresa.id
        }
      });
      
      if (!especialidade) {
        return res.status(404).json({ error: 'Especialidade não encontrada' });
      }
    }
    
    await atendente.update({
      name: req.body.name || atendente.name,
      specialty_id: req.body.specialty_id || atendente.specialty_id,
      phone_mobile: req.body.phone_mobile || atendente.phone_mobile,
      email: req.body.email || atendente.email,
      hiring_date: req.body.hiring_date || atendente.hiring_date,
      administrator: req.body.administrator !== undefined ? req.body.administrator : atendente.administrator,
      active: req.body.active !== undefined ? req.body.active : atendente.active
    });
    
    return res.json(atendente);
  } catch (error) {
    console.error('Erro ao atualizar atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteAtendente = async (req, res) => {
  try {
    const atendente = await Attendant.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }
    
    await atendente.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllAtendentes,
  getAtendenteById,
  createAtendente,
  updateAtendente,
  deleteAtendente
};
