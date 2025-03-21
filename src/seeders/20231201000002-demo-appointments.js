'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Appointments', [
      {
        userId: 2, // John Doe
        serviceId: 1,
        date: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)), // amanhã
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3, // Jane Smith
        serviceId: 2,
        date: new Date(new Date().getTime() + (48 * 60 * 60 * 1000)), // depois de amanhã
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2, // John Doe
        serviceId: 3,
        date: new Date(),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Appointments', null, {});
  }
};
