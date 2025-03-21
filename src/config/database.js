require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: '185.217.127.77',
    port: 5432,
    username: 'postgres',
    password: '984011c5ca123ee9060092a2af946367',
    database: 'agendero',
    define: {
      timestamps: true,
      underscored: false
    },
    logging: true
  }
};
