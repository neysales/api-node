const { Appointment, Customer, Attendant } = require('../models');

const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Appointment.findAll({
      where: { companyId: req.empresa.id },
      include: [
        {
          model: Customer,
          as: 'cliente',
          attributes: ['nome', 'telefone_celular']
        },
        {
          model: Attendant,
          as: 'atendente',
          attributes: ['nome']
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
        companyId: req.empresa.id
      },
      include: [
        {
          model: Customer,
          as: 'cliente',
          attributes: ['nome', 'telefone_celular']
        },
        {
          model: Attendant,
          as: 'atendente',
          attributes: ['nome']
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
    // Verificar se o cliente existe e pertence à empresa
    const cliente = await Customer.findOne({
      where: { 
        id: req.body.customerId
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

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

    // Verificar se já existe agendamento para o mesmo horário e data
    const agendamentoExistente = await Appointment.findOne({
      where: {
        attendantId: req.body.attendantId,
        date: req.body.date,
        status: 'confirmado'
      }
    });

    if (agendamentoExistente) {
      return res.status(400).json({ error: 'Já existe um agendamento para este horário' });
    }

    const novoAgendamento = await Appointment.create({
      customerId: req.body.customerId,
      companyId: req.empresa.id,
      attendantId: req.body.attendantId,
      date: req.body.date,
      isServiceDone: false,
      observations: req.body.observations || null,
      status: req.body.status || 'agendado',
      createdAt: new Date()
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
        companyId: req.empresa.id
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    // Verificar se o cliente existe
    if (req.body.customerId) {
      const cliente = await Customer.findByPk(req.body.customerId);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
    }
    
    // Verificar se o atendente existe e pertence à empresa
    if (req.body.attendantId) {
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
    
    // Atualizar o agendamento
    await agendamento.update({
      customerId: req.body.customerId || agendamento.customerId,
      attendantId: req.body.attendantId || agendamento.attendantId,
      date: req.body.date || agendamento.date,
      isServiceDone: req.body.isServiceDone !== undefined ? req.body.isServiceDone : agendamento.isServiceDone,
      observations: req.body.observations !== undefined ? req.body.observations : agendamento.observations,
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
        companyId: req.empresa.id
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

module.exports = {
  getAllAgendamentos,
  getAgendamentoById,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento
};
