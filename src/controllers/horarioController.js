const { Schedule, Attendant } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Schedule.findAll({
      include: [{
        model: Attendant,
        as: 'attendant',
        where: { company_id: req.empresa.id }
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
        as: 'attendant',
        where: { company_id: req.empresa.id }
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
    const atendente = await Attendant.findOne({
      where: { 
        id: req.body.attendant_id,
        company_id: req.empresa.id
      }
    });

    if (!atendente) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    const novoHorario = await Schedule.create({
      id: uuidv4(),
      attendant_id: req.body.attendant_id,
      day_of_week: req.body.day_of_week,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      active: req.body.active !== undefined ? req.body.active : true,
      registration_date: new Date()
    });

    return res.status(201).json(novoHorario);
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateHorario = async (req, res) => {
  try {
    const horario = await Schedule.findOne({
      where: { id: req.params.id },
      include: [{
        model: Attendant,
        as: 'attendant',
        where: { company_id: req.empresa.id }
      }]
    });
    
    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    
    if (req.body.attendant_id && req.body.attendant_id !== horario.attendant_id) {
      const atendente = await Attendant.findOne({
        where: { 
          id: req.body.attendant_id,
          company_id: req.empresa.id
        }
      });
      
      if (!atendente) {
        return res.status(404).json({ error: 'Atendente não encontrado' });
      }
    }
    
    await horario.update({
      attendant_id: req.body.attendant_id || horario.attendant_id,
      day_of_week: req.body.day_of_week || horario.day_of_week,
      start_time: req.body.start_time || horario.start_time,
      end_time: req.body.end_time || horario.end_time,
      active: req.body.active !== undefined ? req.body.active : horario.active
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
        as: 'attendant',
        where: { company_id: req.empresa.id }
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
