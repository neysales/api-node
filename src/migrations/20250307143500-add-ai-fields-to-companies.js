'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('empresas', 'ai_provider', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'openai'
    });

    await queryInterface.addColumn('empresas', 'ai_api_key', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('empresas', 'ai_model', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'gpt-3.5-turbo'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('empresas', 'ai_provider');
    await queryInterface.removeColumn('empresas', 'ai_api_key');
    await queryInterface.removeColumn('empresas', 'ai_model');
  }
};
