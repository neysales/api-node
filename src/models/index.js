const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    define: dbConfig.define,
    logging: console.log
  }
);

// Import models
const Company = require('./Company')(sequelize, DataTypes);
const Client = require('./Client')(sequelize, DataTypes);
const Attendant = require('./Attendant')(sequelize, DataTypes);
const Specialty = require('./Specialty')(sequelize, DataTypes);
const Appointment = require('./Appointment')(sequelize, DataTypes);
const Schedule = require('./Schedule')(sequelize, DataTypes);
const Config = require('./Config')(sequelize, DataTypes);

// Define the db object first
const db = {
  sequelize,
  Sequelize,
  Company,
  Client,
  Attendant,
  Specialty,
  Appointment,
  Schedule,
  Config
};

// Define associations
Object.values([Company, Client, Attendant, Specialty, Appointment, Schedule, Config])
  .forEach((model) => {
    if (model.associate) {
      model.associate(db);
    }
  });

module.exports = db;
