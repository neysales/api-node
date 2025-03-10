const { Specialty } = require('../models');

const getAllEspecialidades = async (req, res) => {
  try {
    const especialidades = await Specialty.findAll({
      where: { companyId: req.empresa.id }
    });
    
    return res.json(especialidades);
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getEspecialidadeById = async (req, res) => {
  try {
    const especialidade = await Specialty.findOne({
      where: { 
        id: req.params.id,
        companyId: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    return res.json(especialidade);
  } catch (error) {
    console.error('Erro ao buscar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createEspecialidade = async (req, res) => {
  try {
    const novaEspecialidade = await Specialty.create({
      name: req.body.name,
      description: req.body.description,
      companyId: req.empresa.id,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    return res.status(201).json(novaEspecialidade);
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateEspecialidade = async (req, res) => {
  try {
    const especialidade = await Specialty.findOne({
      where: { 
        id: req.params.id,
        companyId: req.empresa.id
      }
    });
    
    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }
    
    await especialidade.update({
      name: req.body.name || especialidade.name,
      description: req.body.description || especialidade.description,
      isActive: req.body.isActive !== undefined ? req.body.isActive : especialidade.isActive
    });
    
    return res.json(especialidade);
  } catch (error) {
    console.error('Erro ao atualizar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteEspecialidade = async (req, res) => {
  try {
    const especialidade = await Specialty.findOne({
      where: { 
        id: req.params.id,
        companyId: req.empresa.id
      }
    });
    
    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }
    
    await especialidade.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllEspecialidades,
  getEspecialidadeById,
  createEspecialidade,
  updateEspecialidade,
  deleteEspecialidade
};
