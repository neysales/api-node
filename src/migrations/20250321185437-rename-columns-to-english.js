'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Renomear colunas da tabela companies (antiga empresas)
      await queryInterface.renameColumn('companies', 'nome', 'name', { transaction });
      await queryInterface.renameColumn('companies', 'atividade', 'activity', { transaction });
      await queryInterface.renameColumn('companies', 'responsavel', 'responsible', { transaction });
      await queryInterface.renameColumn('companies', 'telefone_celular', 'phone_mobile', { transaction });
      await queryInterface.renameColumn('companies', 'chave_api', 'api_key', { transaction });
      await queryInterface.renameColumn('companies', 'ativa', 'active', { transaction });
      await queryInterface.renameColumn('companies', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('companies', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela clients (antiga clientes)
      await queryInterface.renameColumn('clients', 'nome', 'name', { transaction });
      await queryInterface.renameColumn('clients', 'telefone_celular', 'phone_mobile', { transaction });
      await queryInterface.renameColumn('clients', 'data_nascimento', 'birth_date', { transaction });
      await queryInterface.renameColumn('clients', 'observacoes', 'notes', { transaction });
      await queryInterface.renameColumn('clients', 'empresa_id', 'company_id', { transaction });
      await queryInterface.renameColumn('clients', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('clients', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela specialties (antiga especialidades)
      await queryInterface.renameColumn('specialties', 'nome', 'name', { transaction });
      await queryInterface.renameColumn('specialties', 'descricao', 'description', { transaction });
      await queryInterface.renameColumn('specialties', 'empresa_id', 'company_id', { transaction });
      await queryInterface.renameColumn('specialties', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('specialties', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela attendants (antiga atendentes)
      await queryInterface.renameColumn('attendants', 'nome', 'name', { transaction });
      await queryInterface.renameColumn('attendants', 'telefone_celular', 'phone_mobile', { transaction });
      await queryInterface.renameColumn('attendants', 'email', 'email', { transaction }); // Mesmo nome
      await queryInterface.renameColumn('attendants', 'data_contratacao', 'hiring_date', { transaction });
      await queryInterface.renameColumn('attendants', 'ativo', 'active', { transaction });
      await queryInterface.renameColumn('attendants', 'empresa_id', 'company_id', { transaction });
      await queryInterface.renameColumn('attendants', 'especialidade_id', 'specialty_id', { transaction });
      await queryInterface.renameColumn('attendants', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('attendants', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela schedules (antiga horarios)
      await queryInterface.renameColumn('schedules', 'dia_semana', 'weekday', { transaction });
      await queryInterface.renameColumn('schedules', 'hora_inicio', 'start_time', { transaction });
      await queryInterface.renameColumn('schedules', 'hora_fim', 'end_time', { transaction });
      await queryInterface.renameColumn('schedules', 'ativo', 'active', { transaction });
      await queryInterface.renameColumn('schedules', 'empresa_id', 'company_id', { transaction });
      await queryInterface.renameColumn('schedules', 'atendente_id', 'attendant_id', { transaction });
      await queryInterface.renameColumn('schedules', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('schedules', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela appointments (antiga agendamentos)
      await queryInterface.renameColumn('appointments', 'data', 'date', { transaction });
      await queryInterface.renameColumn('appointments', 'status', 'status', { transaction }); // Mesmo nome
      await queryInterface.renameColumn('appointments', 'observacoes', 'notes', { transaction });
      await queryInterface.renameColumn('appointments', 'empresa_id', 'company_id', { transaction });
      await queryInterface.renameColumn('appointments', 'cliente_id', 'client_id', { transaction });
      await queryInterface.renameColumn('appointments', 'atendente_id', 'attendant_id', { transaction });
      await queryInterface.renameColumn('appointments', 'horario_id', 'schedule_id', { transaction });
      await queryInterface.renameColumn('appointments', 'createdAt', 'registration_date', { transaction });
      await queryInterface.renameColumn('appointments', 'updatedAt', 'updated_at', { transaction });

      // Renomear colunas da tabela config
      await queryInterface.renameColumn('config', 'evolution_instancia', 'evolution_instance', { transaction });
      await queryInterface.renameColumn('config', 'email_senha', 'email_password', { transaction });
      await queryInterface.renameColumn('config', 'email_porta', 'email_port', { transaction });
      await queryInterface.renameColumn('config', 'email_texto_agendado', 'email_text_scheduled', { transaction });
      await queryInterface.renameColumn('config', 'email_texto_cancelado', 'email_text_canceled', { transaction });
      await queryInterface.renameColumn('config', 'email_texto_confirmado', 'email_text_confirmed', { transaction });
      await queryInterface.renameColumn('config', 'email_texto_recusado', 'email_text_rejected', { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Reverter renomeação de colunas da tabela companies (para empresas)
      await queryInterface.renameColumn('companies', 'name', 'nome', { transaction });
      await queryInterface.renameColumn('companies', 'activity', 'atividade', { transaction });
      await queryInterface.renameColumn('companies', 'responsible', 'responsavel', { transaction });
      await queryInterface.renameColumn('companies', 'phone_mobile', 'telefone_celular', { transaction });
      await queryInterface.renameColumn('companies', 'api_key', 'chave_api', { transaction });
      await queryInterface.renameColumn('companies', 'active', 'ativa', { transaction });
      await queryInterface.renameColumn('companies', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('companies', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela clients (para clientes)
      await queryInterface.renameColumn('clients', 'name', 'nome', { transaction });
      await queryInterface.renameColumn('clients', 'phone_mobile', 'telefone_celular', { transaction });
      await queryInterface.renameColumn('clients', 'birth_date', 'data_nascimento', { transaction });
      await queryInterface.renameColumn('clients', 'notes', 'observacoes', { transaction });
      await queryInterface.renameColumn('clients', 'company_id', 'empresa_id', { transaction });
      await queryInterface.renameColumn('clients', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('clients', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela specialties (para especialidades)
      await queryInterface.renameColumn('specialties', 'name', 'nome', { transaction });
      await queryInterface.renameColumn('specialties', 'description', 'descricao', { transaction });
      await queryInterface.renameColumn('specialties', 'company_id', 'empresa_id', { transaction });
      await queryInterface.renameColumn('specialties', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('specialties', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela attendants (para atendentes)
      await queryInterface.renameColumn('attendants', 'name', 'nome', { transaction });
      await queryInterface.renameColumn('attendants', 'phone_mobile', 'telefone_celular', { transaction });
      await queryInterface.renameColumn('attendants', 'email', 'email', { transaction }); // Mesmo nome
      await queryInterface.renameColumn('attendants', 'hiring_date', 'data_contratacao', { transaction });
      await queryInterface.renameColumn('attendants', 'active', 'ativo', { transaction });
      await queryInterface.renameColumn('attendants', 'company_id', 'empresa_id', { transaction });
      await queryInterface.renameColumn('attendants', 'specialty_id', 'especialidade_id', { transaction });
      await queryInterface.renameColumn('attendants', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('attendants', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela schedules (para horarios)
      await queryInterface.renameColumn('schedules', 'weekday', 'dia_semana', { transaction });
      await queryInterface.renameColumn('schedules', 'start_time', 'hora_inicio', { transaction });
      await queryInterface.renameColumn('schedules', 'end_time', 'hora_fim', { transaction });
      await queryInterface.renameColumn('schedules', 'active', 'ativo', { transaction });
      await queryInterface.renameColumn('schedules', 'company_id', 'empresa_id', { transaction });
      await queryInterface.renameColumn('schedules', 'attendant_id', 'atendente_id', { transaction });
      await queryInterface.renameColumn('schedules', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('schedules', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela appointments (para agendamentos)
      await queryInterface.renameColumn('appointments', 'date', 'data', { transaction });
      await queryInterface.renameColumn('appointments', 'status', 'status', { transaction }); // Mesmo nome
      await queryInterface.renameColumn('appointments', 'notes', 'observacoes', { transaction });
      await queryInterface.renameColumn('appointments', 'company_id', 'empresa_id', { transaction });
      await queryInterface.renameColumn('appointments', 'client_id', 'cliente_id', { transaction });
      await queryInterface.renameColumn('appointments', 'attendant_id', 'atendente_id', { transaction });
      await queryInterface.renameColumn('appointments', 'schedule_id', 'horario_id', { transaction });
      await queryInterface.renameColumn('appointments', 'registration_date', 'createdAt', { transaction });
      await queryInterface.renameColumn('appointments', 'updated_at', 'updatedAt', { transaction });

      // Reverter renomeação de colunas da tabela config
      await queryInterface.renameColumn('config', 'evolution_instance', 'evolution_instancia', { transaction });
      await queryInterface.renameColumn('config', 'email_password', 'email_senha', { transaction });
      await queryInterface.renameColumn('config', 'email_port', 'email_porta', { transaction });
      await queryInterface.renameColumn('config', 'email_text_scheduled', 'email_texto_agendado', { transaction });
      await queryInterface.renameColumn('config', 'email_text_canceled', 'email_texto_cancelado', { transaction });
      await queryInterface.renameColumn('config', 'email_text_confirmed', 'email_texto_confirmado', { transaction });
      await queryInterface.renameColumn('config', 'email_text_rejected', 'email_texto_recusado', { transaction });
    });
  }
};
