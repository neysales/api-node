'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Renomear tabelas de português para inglês
      await queryInterface.renameTable('empresas', 'companies', { transaction });
      await queryInterface.renameTable('clientes', 'clients', { transaction });
      await queryInterface.renameTable('especialidades', 'specialties', { transaction });
      await queryInterface.renameTable('atendentes', 'attendants', { transaction });
      await queryInterface.renameTable('horarios', 'schedules', { transaction });
      await queryInterface.renameTable('agendamentos', 'appointments', { transaction });
      
      // A tabela config já está com nome em inglês, não precisa renomear
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Reverter renomeação (de inglês para português)
      await queryInterface.renameTable('companies', 'empresas', { transaction });
      await queryInterface.renameTable('clients', 'clientes', { transaction });
      await queryInterface.renameTable('specialties', 'especialidades', { transaction });
      await queryInterface.renameTable('attendants', 'atendentes', { transaction });
      await queryInterface.renameTable('schedules', 'horarios', { transaction });
      await queryInterface.renameTable('appointments', 'agendamentos', { transaction });
      
      // A tabela config já estava com nome em inglês, não precisa reverter
    });
  }
};
