const { sequelize } = require('./src/models');

async function verificarTabela() {
  try {
    const [resultado] = await sequelize.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'clientes\'');
    console.log('Colunas da tabela clientes:', resultado.map(r => r.column_name));
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    sequelize.close();
  }
}

verificarTabela();
