'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyId = uuidv4();
    await queryInterface.bulkInsert('companies', [{
      id: companyId,
      name: 'Empresa Demonstração',
      activity: 'Serviços Gerais',
      responsible: 'Administrador',
      email: 'admin@empresa.com',
      phone_mobile: '11999999999',
      active: true,
      registration_date: new Date(),
      api_key: uuidv4()
    }]);

    const specialtyId = uuidv4();
    await queryInterface.bulkInsert('specialties', [{
      id: specialtyId,
      name: 'Serviço Geral',
      description: 'Serviços gerais da empresa',
      company_id: companyId,
      active: true,
      registration_date: new Date()
    }]);

    await queryInterface.bulkInsert('attendants', [{
      id: uuidv4(),
      name: 'Atendente Demonstração',
      specialty_id: specialtyId,
      company_id: companyId,
      phone_mobile: '11999999999',
      email: 'atendente@empresa.com',
      hiring_date: new Date(),
      administrator: true,
      active: true,
      registration_date: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attendants', null, {});
    await queryInterface.bulkDelete('specialties', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  }
};
