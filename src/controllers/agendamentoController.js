const { Appointment, Client, Attendant } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Appointment.findAll({
      where: { company_id: req.empresa.id },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['name', 'phone_mobile']
        },
        {
          model: Attendant,
          as: 'attendant',
          attributes: ['name']
        }
      ]
    });
    
    return res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getAgendamentoById = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      },
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['name', 'phone_mobile']
        },
        {
          model: Attendant,
          as: 'attendant',
          attributes: ['name']
        }
      ]
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createAgendamento = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { 
        id: req.body.client_id
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const attendant = await Attendant.findOne({
      where: { 
        id: req.body.attendant_id,
        company_id: req.empresa.id
      }
    });

    if (!attendant) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    const agendamentoExistente = await Appointment.findOne({
      where: {
        attendant_id: req.body.attendant_id,
        appointment_date: req.body.appointment_date,
        status: 'confirmed'
      }
    });

    if (agendamentoExistente) {
      return res.status(400).json({ error: 'Já existe um agendamento para este horário' });
    }

    const novoAgendamento = await Appointment.create({
      id: uuidv4(), // Adicionar UUID
      client_id: req.body.client_id,
      company_id: req.empresa.id,
      attendant_id: req.body.attendant_id,
      appointment_date: req.body.appointment_date,
      service_performed: false,
      notes: req.body.notes || null,
      status: req.body.status || 'scheduled',
      registration_date: new Date()
    });

    return res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateAgendamento = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    if (req.body.client_id) {
      const client = await Client.findByPk(req.body.client_id);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
    }
    
    if (req.body.attendant_id) {
      const attendant = await Attendant.findOne({
        where: { 
          id: req.body.attendant_id,
          company_id: req.empresa.id
        }
      });
      
      if (!attendant) {
        return res.status(404).json({ error: 'Atendente não encontrado' });
      }
    }
    
    await agendamento.update({
      client_id: req.body.client_id || agendamento.client_id,
      attendant_id: req.body.attendant_id || agendamento.attendant_id,
      appointment_date: req.body.appointment_date || agendamento.appointment_date,
      service_performed: req.body.service_performed !== undefined ? req.body.service_performed : agendamento.service_performed,
      notes: req.body.notes !== undefined ? req.body.notes : agendamento.notes,
      status: req.body.status || agendamento.status
    });
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteAgendamento = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    await agendamento.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Métodos adicionais para atualização de status
const performService = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    await agendamento.update({
      service_performed: true,
      status: 'completed'
    });
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao marcar serviço como realizado:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    await agendamento.update({
      status: 'cancelled',
      notes: req.body.reason ? `${agendamento.notes || ''} Motivo do cancelamento: ${req.body.reason}` : agendamento.notes
    });
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const confirmAppointment = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    await agendamento.update({
      status: 'confirmed'
    });
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao confirmar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const rejectAppointment = async (req, res) => {
  try {
    const agendamento = await Appointment.findOne({
      where: { 
        id: req.params.id,
        company_id: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    await agendamento.update({
      status: 'rejected',
      notes: req.body.reason ? `${agendamento.notes || ''} Motivo da rejeição: ${req.body.reason}` : agendamento.notes
    });
    
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao rejeitar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllAgendamentos,
  getAgendamentoById,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  performService,
  cancelAppointment,
  confirmAppointment,
  rejectAppointment
};
