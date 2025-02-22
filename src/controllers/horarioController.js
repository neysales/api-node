const { Horario, Atendente } = require('../models');

const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      where: { empresa_id: req.empresa.id },
      include: [{
        model: Atendente,
        attributes: ['nome']
      }]
    });
    
    return res.json(horarios);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getHorarioById = async (req, res) => {
  try {
    const horario = await Horario.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      },
      include: [{
        model: Atendente,
        attributes: ['nome']
      }]
    });

    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }

    return res.json(horario);
  } catch (error) {
    console.error('Erro ao buscar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createHorario = async (req, res) => {
  try {
    // Verificar se o atendente existe e pertence à empresa
    const atendente = await Atendente.findOne({
      where: { 
        id: req.body.atendente_id,
        empresa_id: req.empresa.id
      }
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    const novoHorario = await Horario.create({
      ...req.body,
      empresa_id: req.empresa.id
    });

    return res.status(201).json(novoHorario);
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateHorario = async (req, res) => {
  try {
    const horario = await Horario.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }

    if (req.body.atendente_id) {
      const atendente = await Atendente.findOne({
        where: { 
          id: req.body.atendente_id,
          empresa_id: req.empresa.id
        }
      });

      if (!atendente) {
        return res.status(404).json({ error: 'Atendente não encontrado' });
      }
    }

    await horario.update(req.body);
    return res.json(horario);
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteHorario = async (req, res) => {
  try {
    const horario = await Horario.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }

    await horario.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario
};
