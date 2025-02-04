const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || '185.217.127.77',
  database: 'agenda',
  username: 'postgres',
  password: '984011c5ca123ee9060092a2af946367',
  port: 5432,
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
