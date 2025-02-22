const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || '185.217.127.77',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '984011c5ca123ee9060092a2af946367',
    port: process.env.DB_PORT || 5432,
    database: 'postgres' // conecta ao banco postgres padrão para criar o novo banco
  });

  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL');

    // Verifica se o banco já existe
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'agenda'"
    );

    if (checkResult.rows.length === 0) {
      // Cria o banco de dados se não existir
      await client.query('CREATE DATABASE agenda');
      console.log('Banco de dados "agenda" criado com sucesso!');
    } else {
      console.log('Banco de dados "agenda" já existe.');
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.end();
    process.exit();
  }
}

createDatabase();
