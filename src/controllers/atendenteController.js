const { Attendant, Specialty } = require('../models');

const getAllAtendentes = async (req, res) => {
  try {
    const atendentes = await Attendant.findAll({
      where: { companyId: req.empresa.id },
      include: [{
        model: Specialty,
        as: 'especialidade',
        attributes: ['nome', 'descricao']
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
        companyId: req.empresa.id
      },
      include: [{
        model: Specialty,
        as: 'especialidade',
        attributes: ['nome', 'descricao']
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
    // Verificar se a especialidade existe e pertence à empresa
    const especialidade = await Specialty.findOne({
      where: { 
        id: req.body.specialtyId,
        companyId: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    const novoAtendente = await Attendant.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialtyId: req.body.specialtyId,
      companyId: req.empresa.id,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: new Date()
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
        companyId: req.empresa.id
      }
    });
    
    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }
    
    // Verificar se a especialidade existe e pertence à empresa
    if (req.body.specialtyId) {
      const especialidade = await Specialty.findOne({
        where: { 
          id: req.body.specialtyId,
          companyId: req.empresa.id
        }
      });
      
      if (!especialidade) {
        return res.status(404).json({ error: 'Especialidade não encontrada' });
      }
    }
    
    await atendente.update({
      name: req.body.name || atendente.name,
      email: req.body.email || atendente.email,
      phone: req.body.phone || atendente.phone,
      specialtyId: req.body.specialtyId || atendente.specialtyId,
      isActive: req.body.isActive !== undefined ? req.body.isActive : atendente.isActive
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
        companyId: req.empresa.id
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
