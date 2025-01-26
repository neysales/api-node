const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'agendero',
  username: 'postgres',
  password: '06c0ab8ab1050cd9d6001ce3a89723c3',
  port: 5432,
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
