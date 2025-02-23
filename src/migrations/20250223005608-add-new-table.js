'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('config', {
      id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      logo_url: {
        type: Sequelize.TEXT,
      },
      evolution_url: {
        type: Sequelize.TEXT,
      },
      evolution_key: {
        type: Sequelize.TEXT,
      },
      evolution_instancia: {
        type: Sequelize.TEXT,
      },
      minio_bucket: {
        type: Sequelize.TEXT,
      },
      minio_port: {
        type: Sequelize.TEXT,
      },
      minio_access_key: {
        type: Sequelize.TEXT,
      },
      minio_secret_key: {
        type: Sequelize.TEXT,
      },
      minio_endpoint: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      email_senha: {
        type: Sequelize.TEXT,
      },
      email_smtp: {
        type: Sequelize.TEXT,
      },
      email_porta: {
        type: Sequelize.TEXT,
      },
      email_texto_agendado: {
        type: Sequelize.TEXT,
      },
      email_texto_cancelado: {
        type: Sequelize.TEXT,
      },
      email_texto_confirmado: {
        type: Sequelize.TEXT,
      },
      email_texto_recusado: {
        type: Sequelize.TEXT,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('config');
  }
};
