const parseConnectionString = (connectionString) => {
  if (!connectionString) {
    throw new Error('Database connection string not provided. Please set ConnectionStrings__PostgresConnection in your docker-compose.yml');
  }

  const params = {};
  connectionString.split(';').forEach(param => {
    const [key, value] = param.split('=');
    params[key.toLowerCase()] = value;
  });
  return params;
};

const getDbConfig = () => {
  const connectionString = process.env.ConnectionStrings__PostgresConnection;
  const dbParams = parseConnectionString(connectionString);

  return {
    dialect: 'postgres',
    host: dbParams.host,
    database: dbParams.database,
    username: dbParams.username,
    password: dbParams.password,
    port: 5432,
    define: {
      timestamps: true,
      underscored: false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  };
};

const config = getDbConfig();

module.exports = {
  development: config,
  test: config,
  production: config
};
