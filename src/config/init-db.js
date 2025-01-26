const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '06c0ab8ab1050cd9d6001ce3a89723c3',
    port: process.env.DB_PORT || 5432,
    database: 'agendero'
  });

  try {
    // Conecta ao PostgreSQL
    await client.connect();
    console.log('Conectado ao PostgreSQL');

    // Lê o arquivo SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'init-db.sql'),
      'utf8'
    );

    // Executa o script SQL
    await client.query(sqlScript);
    console.log('Banco de dados inicializado com sucesso!');

  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Executa a inicialização se este arquivo for executado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Processo de inicialização concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Falha na inicialização:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
