const { Atendente, Especialidade } = require('../models');

const getAllAtendentes = async (req, res) => {
  try {
    const atendentes = await Atendente.findAll({
      where: { empresa_id: req.empresa.id },
      include: [{
        model: Especialidade,
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
    const atendente = await Atendente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      },
      include: [{
        model: Especialidade,
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
    const especialidade = await Especialidade.findOne({
      where: { 
        id: req.body.especialidade_id,
        empresa_id: req.empresa.id
      }
    });

    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    const novoAtendente = await Atendente.create({
      ...req.body,
      empresa_id: req.empresa.id,
      data_contratacao: req.body.data_contratacao || new Date()
    });

    return res.status(201).json(novoAtendente);
  } catch (error) {
    console.error('Erro ao criar atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateAtendente = async (req, res) => {
  try {
    const atendente = await Atendente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    if (req.body.especialidade_id) {
      const especialidade = await Especialidade.findOne({
        where: { 
          id: req.body.especialidade_id,
          empresa_id: req.empresa.id
        }
      });

      if (!especialidade) {
        return res.status(404).json({ error: 'Especialidade não encontrada' });
      }
    }

    await atendente.update(req.body);
    return res.json(atendente);
  } catch (error) {
    console.error('Erro ao atualizar atendente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteAtendente = async (req, res) => {
  try {
    const atendente = await Atendente.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    await atendente.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar atendente:', error);
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
