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
const Customer = require('./Customer')(sequelize, DataTypes);
const Attendant = require('./Attendant')(sequelize, DataTypes);
const Specialty = require('./Specialty')(sequelize, DataTypes);
const Appointment = require('./Appointment')(sequelize, DataTypes);
const Schedule = require('./Schedule')(sequelize, DataTypes);

// Define relationships
Company.hasMany(Customer, { foreignKey: 'companyId' });
Customer.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Attendant, { foreignKey: 'companyId' });
Attendant.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Specialty, { foreignKey: 'companyId' });
Specialty.belongsTo(Company, { foreignKey: 'companyId' });

Attendant.belongsTo(Specialty, { foreignKey: 'specialtyId' });
Specialty.hasMany(Attendant, { foreignKey: 'specialtyId' });

Company.hasMany(Appointment, { foreignKey: 'companyId' });
Appointment.belongsTo(Company, { foreignKey: 'companyId' });

Customer.hasMany(Appointment, { foreignKey: 'customerId' });
Appointment.belongsTo(Customer, { foreignKey: 'customerId' });

Attendant.hasMany(Appointment, { foreignKey: 'attendantId' });
Appointment.belongsTo(Attendant, { foreignKey: 'attendantId' });

Attendant.hasMany(Schedule, { foreignKey: 'attendantId' });
Schedule.belongsTo(Attendant, { foreignKey: 'attendantId' });

const db = {
  sequelize,
  Sequelize,
  Company,
  Customer,
  Attendant,
  Specialty,
  Appointment,
  Schedule
};

module.exports = db;
