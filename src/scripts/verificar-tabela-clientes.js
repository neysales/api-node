const { Sequelize } = require('sequelize');
require('dotenv').config();

const parseConnectionString = (connectionString) => {
  if (!connectionString) {
    throw new Error('String de conexão do banco de dados não fornecida.');
  }

  const params = {};
  connectionString.split(';').forEach(param => {
    const [key, value] = param.split('=');
    params[key.toLowerCase()] = value;
  });
  return params;
};

const main = async () => {
  try {
    const connectionString = process.env.ConnectionStrings__PostgresConnection;
    const dbParams = parseConnectionString(connectionString);

    const sequelize = new Sequelize(
      dbParams.database,
      dbParams.username,
      dbParams.password,
      {
        host: dbParams.host,
        port: 5432,
        dialect: 'postgres',
        logging: console.log
      }
    );

    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!');

    console.log('Verificando estrutura da tabela clientes...');
    const [result] = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clientes'"
    );

    console.log('Estrutura da tabela clientes:');
    console.table(result);

    await sequelize.close();
  } catch (error) {
    console.error('Erro ao verificar tabela:', error);
  }
};

main();
