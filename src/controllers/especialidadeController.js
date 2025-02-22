const { Especialidade } = require('../models');

const getAllEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidade.findAll({
      where: { empresa_id: req.empresa.id }
    });
    
    return res.json(especialidades);
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getEspecialidadeById = async (req, res) => {
  try {
    const especialidade = await Especialidade.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
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
    const novaEspecialidade = await Especialidade.create({
      ...req.body,
      empresa_id: req.empresa.id
    });

    return res.status(201).json(novaEspecialidade);
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateEspecialidade = async (req, res) => {
  try {
    const especialidade = await Especialidade.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    await especialidade.update(req.body);
    return res.json(especialidade);
  } catch (error) {
    console.error('Erro ao atualizar especialidade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteEspecialidade = async (req, res) => {
  try {
    const especialidade = await Especialidade.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    await especialidade.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar especialidade:', error);
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
