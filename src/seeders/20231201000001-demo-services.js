'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Services', [
      {
        name: 'Corte de Cabelo',
        description: 'Corte masculino ou feminino',
        duration: 30,
        price: 50.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manicure',
        description: 'Tratamento completo para unhas',
        duration: 45,
        price: 35.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Services', null, {});
  }
};
