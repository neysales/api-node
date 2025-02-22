const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConfig = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || '185.217.127.77',
    database: process.env.DB_NAME || 'agenda',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '984011c5ca123ee9060092a2af946367',
    port: process.env.DB_PORT || 5432,
    define: {
      timestamps: true,
      underscored: false
    }
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || '185.217.127.77',
    database: process.env.DB_NAME || 'agenda',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '984011c5ca123ee9060092a2af946367',
    port: process.env.DB_PORT || 5432,
    define: {
      timestamps: true,
      underscored: false
    }
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST || '185.217.127.77',
    database: process.env.DB_NAME || 'agenda',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '984011c5ca123ee9060092a2af946367',
    port: process.env.DB_PORT || 5432,
    define: {
      timestamps: true,
      underscored: false
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    define: config.define,
    logging: console.log
  }
);

module.exports = sequelize;
