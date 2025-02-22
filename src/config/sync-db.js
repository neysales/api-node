const sequelize = require('./database');
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const Attendant = require('../models/Attendant');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const Specialty = require('../models/Specialty');

async function syncDatabase() {
  try {
    // Sincroniza as tabelas sem forçar recriação
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  } finally {
    process.exit();
  }
}

syncDatabase();
