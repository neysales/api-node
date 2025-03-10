require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
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

// Gerar IDs únicos para referência
const empresaId = uuidv4();
const especialidade1Id = uuidv4();
const especialidade2Id = uuidv4();
const atendente1Id = uuidv4();
const atendente2Id = uuidv4();
const cliente1Id = uuidv4();
const cliente2Id = uuidv4();
const horario1Id = uuidv4();
const horario2Id = uuidv4();
const configId = uuidv4();
const agendamento1Id = uuidv4();
const agendamento2Id = uuidv4();

// Dados de exemplo
const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserindo dados de exemplo...');
    
    // Inserir empresa
    console.log('Inserindo empresa...');
    await client.query(`
      INSERT INTO empresas (
        id, nome, atividade, responsavel, endereco_rua, endereco_cidade, 
        endereco_estado, endereco_bairro, endereco_cep, endereco_pais, 
        endereco_complemento, endereco_numero, telefone_fixo, 
        telefone_celular, telefone_whatsapp, email, ativa, 
        data_cadastro, chave_api
      ) VALUES (
        $1, 'Salão Beleza Total', 'Salão de Beleza', 'Maria Silva', 
        'Rua das Flores', 'São Paulo', 'SP', 'Centro', '01234-567', 
        'Brasil', 'Sala 101', '123', '(11) 3456-7890', 
        '(11) 98765-4321', '(11) 98765-4321', 'contato@belezatotal.com.br', 
        true, CURRENT_TIMESTAMP, $2
      )
    `, [empresaId, '446AE6DD89E64F7F9D8964B595035644']);
    
    // Inserir especialidades
    console.log('Inserindo especialidades...');
    await client.query(`
      INSERT INTO especialidades (
        id, empresa_id, nome, descricao, ativa, data_cadastro
      ) VALUES (
        $1, $2, 'Corte de Cabelo', 'Serviços de corte de cabelo', 
        true, CURRENT_TIMESTAMP
      )
    `, [especialidade1Id, empresaId]);
    
    await client.query(`
      INSERT INTO especialidades (
        id, empresa_id, nome, descricao, ativa, data_cadastro
      ) VALUES (
        $1, $2, 'Manicure', 'Serviços de manicure e pedicure', 
        true, CURRENT_TIMESTAMP
      )
    `, [especialidade2Id, empresaId]);
    
    // Inserir atendentes
    console.log('Inserindo atendentes...');
    await client.query(`
      INSERT INTO atendentes (
        id, empresa_id, nome, especialidade_id, telefone_celular, 
        email, data_contratacao, administrador, ativo, data_cadastro
      ) VALUES (
        $1, $2, 'João Silva', $3, '(11) 98765-1234', 
        'joao@belezatotal.com.br', CURRENT_TIMESTAMP, false, true, CURRENT_TIMESTAMP
      )
    `, [atendente1Id, empresaId, especialidade1Id]);
    
    await client.query(`
      INSERT INTO atendentes (
        id, empresa_id, nome, especialidade_id, telefone_celular, 
        email, data_contratacao, administrador, ativo, data_cadastro
      ) VALUES (
        $1, $2, 'Ana Souza', $3, '(11) 98765-5678', 
        'ana@belezatotal.com.br', CURRENT_TIMESTAMP, false, true, CURRENT_TIMESTAMP
      )
    `, [atendente2Id, empresaId, especialidade2Id]);
    
    // Inserir clientes
    console.log('Inserindo clientes...');
    await client.query(`
      INSERT INTO clientes (
        id, nome, cpf_cnpj, data_nascimento, telefone_celular, 
        email, endereco_rua, endereco_cidade, endereco_estado, 
        endereco_bairro, endereco_cep, endereco_pais, 
        endereco_complemento, endereco_numero, observacoes, 
        data_cadastro, senha, ativo
      ) VALUES (
        $1, 'Carlos Oliveira', '123.456.789-00', '1985-05-15', '(11) 98888-7777', 
        'carlos@email.com', 'Rua das Palmeiras', 'São Paulo', 'SP', 
        'Jardins', '01234-567', 'Brasil', 'Apto 101', '123', 
        'Cliente VIP', CURRENT_TIMESTAMP, 'senha123', true
      )
    `, [cliente1Id]);
    
    await client.query(`
      INSERT INTO clientes (
        id, nome, cpf_cnpj, data_nascimento, telefone_celular, 
        email, endereco_rua, endereco_cidade, endereco_estado, 
        endereco_bairro, endereco_cep, endereco_pais, 
        endereco_complemento, endereco_numero, observacoes, 
        data_cadastro, senha, ativo
      ) VALUES (
        $1, 'Fernanda Santos', '987.654.321-00', '1990-10-20', '(11) 99999-8888', 
        'fernanda@email.com', 'Av. Paulista', 'São Paulo', 'SP', 
        'Bela Vista', '01310-100', 'Brasil', 'Sala 1010', '1000', 
        'Cliente frequente', CURRENT_TIMESTAMP, 'senha456', true
      )
    `, [cliente2Id]);
    
    // Inserir relação entre clientes e empresas
    console.log('Inserindo relação entre clientes e empresas...');
    await client.query(`
      INSERT INTO clientes_empresas (
        cliente_id, empresa_id, data_cadastro
      ) VALUES (
        $1, $2, CURRENT_TIMESTAMP
      )
    `, [cliente1Id, empresaId]);
    
    await client.query(`
      INSERT INTO clientes_empresas (
        cliente_id, empresa_id, data_cadastro
      ) VALUES (
        $1, $2, CURRENT_TIMESTAMP
      )
    `, [cliente2Id, empresaId]);
    
    // Inserir horários
    console.log('Inserindo horários...');
    await client.query(`
      INSERT INTO horarios (
        id, atendente_id, dia_semana, hora_inicio, 
        hora_fim, ativo, data_cadastro
      ) VALUES (
        $1, $2, 'Segunda-feira', '09:00:00', 
        '18:00:00', true, CURRENT_TIMESTAMP
      )
    `, [horario1Id, atendente1Id]);
    
    await client.query(`
      INSERT INTO horarios (
        id, atendente_id, dia_semana, hora_inicio, 
        hora_fim, ativo, data_cadastro
      ) VALUES (
        $1, $2, 'Terça-feira', '09:00:00', 
        '18:00:00', true, CURRENT_TIMESTAMP
      )
    `, [horario2Id, atendente2Id]);
    
    // Inserir configuração
    console.log('Inserindo configuração...');
    await client.query(`
      INSERT INTO config (
        id, empresa_id, logo_url, evolution_url, evolution_key, 
        evolution_instancia, minio_bucket, minio_port, minio_access_key, 
        minio_secret_key, minio_endpoint, email, email_senha, 
        email_smtp, email_porta, email_texto_agendado, 
        email_texto_cancelado, email_texto_confirmado, 
        email_texto_recusado, data_cadastro
      ) VALUES (
        $1, $2, 'https://exemplo.com/logo.png', 'https://api.evolution.com', 
        'evolution-api-key', 'instancia1', 'agendero-bucket', '9000', 
        'minio-access-key', 'minio-secret-key', 'https://minio.exemplo.com', 
        'notificacoes@belezatotal.com.br', 'senha123', 'smtp.exemplo.com', 
        '587', 'Seu agendamento foi realizado com sucesso!', 
        'Seu agendamento foi cancelado.', 'Seu agendamento foi confirmado!', 
        'Seu agendamento foi recusado.', CURRENT_TIMESTAMP
      )
    `, [configId, empresaId]);
    
    // Inserir agendamentos
    console.log('Inserindo agendamentos...');
    await client.query(`
      INSERT INTO agendamentos (
        id, empresa_id, cliente_id, atendente_id, 
        data_agendamento, servico_realizado, observacoes, 
        status, data_cadastro
      ) VALUES (
        $1, $2, $3, $4, '2025-03-15 10:00:00', 
        false, 'Corte simples', 'Agendado', CURRENT_TIMESTAMP
      )
    `, [agendamento1Id, empresaId, cliente1Id, atendente1Id]);
    
    await client.query(`
      INSERT INTO agendamentos (
        id, empresa_id, cliente_id, atendente_id, 
        data_agendamento, servico_realizado, observacoes, 
        status, data_cadastro
      ) VALUES (
        $1, $2, $3, $4, '2025-03-16 14:00:00', 
        false, 'Manicure completa', 'Agendado', CURRENT_TIMESTAMP
      )
    `, [agendamento2Id, empresaId, cliente2Id, atendente2Id]);
    
    await client.query('COMMIT');
    console.log('Dados de exemplo inseridos com sucesso!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao inserir dados de exemplo:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

// Executar a função de seed
seedData();
