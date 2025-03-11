const { sequelize } = require('./src/models');

async function verificarModelo() {
  try {
    // Verificar se há alguma tabela que relaciona clientes com empresas
    const [resultado] = await sequelize.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND (tc.table_name = 'clientes' OR ccu.table_name = 'clientes')
    `);
    
    console.log('Relações de chave estrangeira com a tabela clientes:', resultado);
    
    // Verificar se há alguma coluna na tabela clientes que pode ser o ID da empresa
    const [colunas] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
        AND (column_name LIKE '%empresa%' OR column_name LIKE '%company%' OR data_type = 'uuid')
    `);
    
    console.log('Possíveis colunas para ID da empresa na tabela clientes:', colunas);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    sequelize.close();
  }
}

verificarModelo();
