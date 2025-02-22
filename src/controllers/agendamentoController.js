const { Agendamento, Cliente, Atendente, Horario } = require('../models');

const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll({
      where: { empresa_id: req.empresa.id },
      include: [
        {
          model: Cliente,
          attributes: ['nome', 'telefone_celular']
        },
        {
          model: Atendente,
          attributes: ['nome']
        },
        {
          model: Horario,
          attributes: ['dia_semana', 'hora_inicio', 'hora_fim']
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
    const agendamento = await Agendamento.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      },
      include: [
        {
          model: Cliente,
          attributes: ['nome', 'telefone_celular']
        },
        {
          model: Atendente,
          attributes: ['nome']
        },
        {
          model: Horario,
          attributes: ['dia_semana', 'hora_inicio', 'hora_fim']
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
    const cliente = await Cliente.findOne({
      where: { 
        id: req.body.cliente_id,
        empresa_id: req.empresa.id
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

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

    // Verificar se o horário existe e pertence à empresa
    const horario = await Horario.findOne({
      where: { 
        id: req.body.horario_id,
        empresa_id: req.empresa.id
      }
    });

    if (!horario) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }

    // Verificar se já existe agendamento para o mesmo horário
    const agendamentoExistente = await Agendamento.findOne({
      where: {
        horario_id: req.body.horario_id,
        data: req.body.data,
        status: 'confirmado'
      }
    });

    if (agendamentoExistente) {
      return res.status(400).json({ error: 'Horário já está agendado' });
    }

    const novoAgendamento = await Agendamento.create({
      ...req.body,
      empresa_id: req.empresa.id,
      status: req.body.status || 'confirmado'
    });

    return res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (req.body.cliente_id) {
      const cliente = await Cliente.findOne({
        where: { 
          id: req.body.cliente_id,
          empresa_id: req.empresa.id
        }
      });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
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

    if (req.body.horario_id) {
      const horario = await Horario.findOne({
        where: { 
          id: req.body.horario_id,
          empresa_id: req.empresa.id
        }
      });

      if (!horario) {
        return res.status(404).json({ error: 'Horário não encontrado' });
      }

      // Verificar se já existe agendamento para o novo horário
      const agendamentoExistente = await Agendamento.findOne({
        where: {
          horario_id: req.body.horario_id,
          data: req.body.data || agendamento.data,
          status: 'confirmado',
          id: { [Op.ne]: req.params.id }
        }
      });

      if (agendamentoExistente) {
        return res.status(400).json({ error: 'Horário já está agendado' });
      }
    }

    await agendamento.update(req.body);
    return res.json(agendamento);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findOne({
      where: { 
        id: req.params.id,
        empresa_id: req.empresa.id
      }
    });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    await agendamento.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
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
