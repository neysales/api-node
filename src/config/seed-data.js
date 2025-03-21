require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.ConnectionStrings__PostgresConnection
});

// Gerar IDs únicos
const companyId = uuidv4();
const specialtyId1 = uuidv4();
const specialtyId2 = uuidv4();
const attendantId1 = uuidv4();
const attendantId2 = uuidv4();
const clientId1 = uuidv4();
const clientId2 = uuidv4();
const scheduleId1 = uuidv4();
const scheduleId2 = uuidv4();
const configId = uuidv4();
const appointmentId1 = uuidv4();
const appointmentId2 = uuidv4();

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserindo dados de exemplo...');
    
    // Inserir company
    console.log('Inserindo empresa...');
    await client.query(`
      INSERT INTO companies (
        id, name, activity, responsible, address_street, address_city,
        address_state, address_neighborhood, address_zip, address_country,
        address_complement, address_number, phone_landline,
        phone_mobile, phone_whatsapp, email, active,
        registration_date, api_key
      ) VALUES (
        $1, 'Salão Beleza Total', 'Salão de Beleza', 'Maria Silva',
        'Rua das Flores', 'São Paulo', 'SP', 'Centro', '01234-567',
        'Brasil', 'Sala 101', '123', '(11) 3456-7890',
        '(11) 98765-4321', '(11) 98765-4321', 'contato@belezatotal.com.br',
        true, CURRENT_TIMESTAMP, $2
      )
    `, [companyId, '446AE6DD89E64F7F9D8964B595035644']);

    // Inserir specialties
    console.log('Inserindo especialidades...');
    await client.query(`
      INSERT INTO specialties (
        id, company_id, name, description, active, registration_date
      ) VALUES (
        $1, $2, 'Corte de Cabelo', 'Serviços de corte de cabelo',
        true, CURRENT_TIMESTAMP
      )
    `, [specialtyId1, companyId]);

    await client.query(`
      INSERT INTO specialties (
        id, company_id, name, description, active, registration_date
      ) VALUES (
        $1, $2, 'Manicure', 'Serviços de manicure e pedicure',
        true, CURRENT_TIMESTAMP
      )
    `, [specialtyId2, companyId]);

    // Inserir attendants
    console.log('Inserindo atendentes...');
    await client.query(`
      INSERT INTO attendants (
        id, company_id, name, specialty_id, phone_mobile,
        email, hiring_date, administrator, active, registration_date
      ) VALUES (
        $1, $2, 'João Silva', $3, '(11) 98765-1234',
        'joao@belezatotal.com.br', CURRENT_TIMESTAMP, false, true, CURRENT_TIMESTAMP
      )
    `, [attendantId1, companyId, specialtyId1]);

    await client.query(`
      INSERT INTO attendants (
        id, company_id, name, specialty_id, phone_mobile,
        email, hiring_date, administrator, active, registration_date
      ) VALUES (
        $1, $2, 'Ana Souza', $3, '(11) 98765-5678',
        'ana@belezatotal.com.br', CURRENT_TIMESTAMP, false, true, CURRENT_TIMESTAMP
      )
    `, [attendantId2, companyId, specialtyId2]);

    // Inserir clients
    console.log('Inserindo clientes...');
    await client.query(`
      INSERT INTO clients (
        id, name, cpf_cnpj, birth_date, phone_mobile,
        email, address_street, address_city, address_state,
        address_neighborhood, address_zip, address_country,
        address_complement, address_number, notes,
        registration_date, password, active
      ) VALUES (
        $1, 'Carlos Oliveira', '123.456.789-00', '1985-05-15', '(11) 98888-7777',
        'carlos@email.com', 'Rua das Palmeiras', 'São Paulo', 'SP',
        'Jardins', '01234-567', 'Brasil', 'Apto 101', '123',
        'Cliente VIP', CURRENT_TIMESTAMP, 'senha123', true
      )
    `, [clientId1]);

    // Inserir clients_companies
    console.log('Inserindo relação entre clientes e empresas...');
    await client.query(`
      INSERT INTO clients_companies (
        client_id, company_id, registration_date
      ) VALUES ($1, $2, CURRENT_TIMESTAMP)
    `, [clientId1, companyId]);

    // Inserir schedules
    console.log('Inserindo horários...');
    await client.query(`
      INSERT INTO schedules (
        id, attendant_id, day_of_week, start_time,
        end_time, active, registration_date
      ) VALUES (
        $1, $2, 'Monday', '09:00:00',
        '18:00:00', true, CURRENT_TIMESTAMP
      )
    `, [scheduleId1, attendantId1]);

    // Inserir config
    console.log('Inserindo configuração...');
    await client.query(`
      INSERT INTO config (
        id, company_id, logo_url, evolution_url, evolution_key,
        evolution_instance, minio_bucket, minio_port, minio_access_key,
        minio_secret_key, minio_endpoint, email, email_password,
        email_smtp, email_port, email_text_scheduled,
        email_text_canceled, email_text_confirmed,
        email_text_rejected, ai_provider, ai_api_key, ai_model,
        registration_date
      ) VALUES (
        $1, $2, 'https://exemplo.com/logo.png', 'https://api.evolution.com',
        'evolution-api-key', 'instance1', 'agendero-bucket', '9000',
        'minio-access-key', 'minio-secret-key', 'https://minio.exemplo.com',
        'notificacoes@belezatotal.com.br', 'senha123', 'smtp.exemplo.com',
        '587', 'Seu agendamento foi realizado com sucesso!',
        'Seu agendamento foi cancelado.', 'Seu agendamento foi confirmado!',
        'Seu agendamento foi recusado.', 'openai', 
        '${process.env.AI_API_KEY || ''}', 'gpt-3.5-turbo',
        CURRENT_TIMESTAMP
      )
    `, [configId, companyId]);

    // Inserir appointments
    console.log('Inserindo agendamentos...');
    await client.query(`
      INSERT INTO appointments (
        id, client_id, company_id, attendant_id,
        appointment_date, service_performed, notes,
        status, registration_date
      ) VALUES (
        $1, $2, $3, $4, '2025-03-15 10:00:00',
        false, 'Corte simples', 'scheduled', CURRENT_TIMESTAMP
      )
    `, [appointmentId1, clientId1, companyId, attendantId1]);

    await client.query('COMMIT');
    console.log('Dados de exemplo inseridos com sucesso!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao inserir dados de exemplo:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedData().catch(console.error);
