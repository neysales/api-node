const sequelize = require('./database');
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const Attendant = require('../models/Attendant');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const Specialty = require('../models/Specialty');

async function syncDatabase() {
  try {
    // Força a recriação das tabelas
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  } finally {
    process.exit();
  }
}

syncDatabase();
