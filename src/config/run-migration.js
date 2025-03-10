require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Obter configuração do banco de dados do arquivo de ambiente
const connectionString = process.env.ConnectionStrings__PostgresConnection;

// Função para analisar a string de conexão
const parseConnectionString = (connString) => {
  if (!connString) {
    throw new Error('String de conexão não fornecida');
  }

  const params = {};
  connString.split(';').forEach(param => {
    const [key, value] = param.split('=');
    params[key.toLowerCase()] = value;
  });
  return params;
};

// Analisar a string de conexão
const dbParams = parseConnectionString(connectionString);

// Configurar a conexão com o banco de dados
const pool = new Pool({
  host: dbParams.host,
  port: parseInt(dbParams.port),
  database: dbParams.database,
  user: dbParams.username,
  password: dbParams.password
});

// Ler o arquivo SQL
const sqlFilePath = path.join(__dirname, 'init-db.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

// Executar o script SQL
async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Iniciando a execução do script de migração...');
    await client.query(sqlScript);
    console.log('Script de migração executado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o script de migração:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
