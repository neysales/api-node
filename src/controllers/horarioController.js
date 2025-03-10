const { Schedule, Attendant } = require('../models');

const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Schedule.findAll({
      include: [{
        model: Attendant,
        as: 'atendente',
        where: { companyId: req.empresa.id }
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
    const horario = await Schedule.findOne({
      where: { 
        id: req.params.id
      },
      include: [{
        model: Attendant,
        as: 'atendente',
        where: { companyId: req.empresa.id }
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
    const atendente = await Attendant.findOne({
      where: { 
        id: req.body.attendantId,
        companyId: req.empresa.id
      }
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    const novoHorario = await Schedule.create({
      attendantId: req.body.attendantId,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    return res.status(201).json(novoHorario);
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateHorario = async (req, res) => {
  try {
    // Verificar se o horário existe
    const horario = await Schedule.findOne({
      where: { id: req.params.id },
      include: [{
        model: Attendant,
        as: 'atendente',
        where: { companyId: req.empresa.id }
      }]
    });
    
    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    
    // Se estiver atualizando o atendente, verificar se o novo atendente existe
    if (req.body.attendantId && req.body.attendantId !== horario.attendantId) {
      const atendente = await Attendant.findOne({
        where: { 
          id: req.body.attendantId,
          companyId: req.empresa.id
        }
      });
      
      if (!atendente) {
        return res.status(404).json({ error: 'Atendente não encontrado' });
      }
    }
    
    await horario.update({
      attendantId: req.body.attendantId || horario.attendantId,
      dayOfWeek: req.body.dayOfWeek || horario.dayOfWeek,
      startTime: req.body.startTime || horario.startTime,
      endTime: req.body.endTime || horario.endTime,
      isActive: req.body.isActive !== undefined ? req.body.isActive : horario.isActive
    });
    
    return res.json(horario);
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteHorario = async (req, res) => {
  try {
    const horario = await Schedule.findOne({
      where: { id: req.params.id },
      include: [{
        model: Attendant,
        as: 'atendente',
        where: { companyId: req.empresa.id }
      }]
    });
    
    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    
    await horario.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
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
