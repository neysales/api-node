const { sequelize } = require('../models');

async function checkTableStructure() {
  try {
    // Verificar todas as tabelas existentes
    const [tables] = await sequelize.query(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename != 'SequelizeMeta'"
    );
    
    console.log('Tabelas existentes no banco de dados:');
    console.log(tables.map(t => t.tablename));

    // Para cada tabela, verificar sua estrutura
    for (const table of tables) {
      const tableName = table.tablename;
      const [columns] = await sequelize.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}' AND table_schema = 'public'`
      );
      
      console.log(`\nEstrutura da tabela ${tableName}:`);
      console.log(columns);
    }

    // Encerrar a conexão
    await sequelize.close();
  } catch (error) {
    console.error('Erro ao verificar a estrutura das tabelas:', error);
    process.exit(1);
  }
}

checkTableStructure();
