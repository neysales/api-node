require('dotenv').config();
const { sequelize } = require('../models');

/**
 * Script para corrigir as incompatibilidades entre os modelos e o banco de dados
 * Este script cria adaptadores para as principais rotas da API
 */
async function corrigirRotas() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se as tabelas existem
    const [tabelas] = await sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
    );
    
    console.log('Tabelas encontradas no banco de dados:');
    console.log(tabelas.map(t => t.table_name));

    // Criar tabela de company se não existir
    if (!tabelas.some(t => t.table_name === 'companies')) {
      console.log('Criando tabela de company...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.companies (
          id UUID NOT NULL, 
          name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,    
          activity VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
          responsible VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
          address_street TEXT COLLATE pg_catalog."default",
          address_city TEXT COLLATE pg_catalog."default",
          address_state TEXT COLLATE pg_catalog."default",
          address_neighborhood TEXT COLLATE pg_catalog."default",
          address_zip TEXT COLLATE pg_catalog."default",
          address_country TEXT COLLATE pg_catalog."default",
          address_complement TEXT COLLATE pg_catalog."default",
          address_number TEXT COLLATE pg_catalog."default",
          phone_landline TEXT COLLATE pg_catalog."default",
          phone_mobile TEXT COLLATE pg_catalog."default",
          phone_whatsapp TEXT COLLATE pg_catalog."default",
          email VARCHAR(255) COLLATE pg_catalog."default",
          active BOOLEAN NOT NULL DEFAULT TRUE,
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          api_key UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
          CONSTRAINT pk_companies PRIMARY KEY (id)
        );
      `);
      console.log('Tabela de company criada com sucesso!');
    }

    // Verificar se a empresa com a API key já existe
    const apiKey = process.env.Authentication__ApiKey;
    const [company] = await sequelize.query(
      `SELECT id, nome FROM company WHERE api_key = '${apiKey}'`
    );

    if (company.length === 0) {
      console.log('Criando empresa com a API key configurada...');
      await sequelize.query(`
        INSERT INTO company (
          name, 
          activity, 
          responsible, 
          phone_mobile, 
          api_key, 
          active, 
          "registration_date",
          "updatedAt"
        ) VALUES (
          'Empresa Teste', 
          'Serviços', 
          'Administrador', 
          '(11) 99999-9999', 
          '${apiKey}', 
          true, 
          NOW(),
        );
      `);
      console.log('Empresa criada com sucesso!');
    } else {
      console.log('Empresa já existe:', company[0]);
    }

    // Criar tabela de clientes se não existir
    if (!tabelas.some(t => t.table_name === 'clients')) {
      console.log('Criando tabela de clientes...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.clients (
          id UUID NOT NULL,
          name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
          cpf_cnpj VARCHAR(20) UNIQUE,
          birth_date DATE,
          phone_mobile TEXT COLLATE pg_catalog."default" NOT NULL,
          email VARCHAR(255) COLLATE pg_catalog."default" UNIQUE,
          address_street TEXT COLLATE pg_catalog."default",
          address_city TEXT COLLATE pg_catalog."default",
          address_state TEXT COLLATE pg_catalog."default",
          address_neighborhood TEXT COLLATE pg_catalog."default",
          address_zip TEXT COLLATE pg_catalog."default",
          address_country TEXT COLLATE pg_catalog."default",
          address_complement TEXT COLLATE pg_catalog."default",
          address_number TEXT COLLATE pg_catalog."default",
          notes TEXT COLLATE pg_catalog."default",
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          password TEXT COLLATE pg_catalog."default" NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          CONSTRAINT pk_clients PRIMARY KEY (id)
        );
      `);
      console.log('Tabela de clientes criada com sucesso!');
    }

    // Criar tabela de atendentes se não existir
    if (!tabelas.some(t => t.table_name === 'attendants')) {
      console.log('Criando tabela de atendentes...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.attendants (
          id UUID NOT NULL,
          name VARCHAR(150) NOT NULL,
          specialty_id UUID NOT NULL,
          company_id UUID NOT NULL,
          phone_mobile TEXT NOT NULL,
          email VARCHAR(255) NOT NULL,
          hiring_date TIMESTAMP WITH TIME ZONE NOT NULL,
          administrator BOOLEAN NOT NULL DEFAULT FALSE,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_attendants PRIMARY KEY (id),
          CONSTRAINT fk_attendants_specialty FOREIGN KEY (specialty_id)
              REFERENCES public.specialties (id)
              ON UPDATE CASCADE
              ON DELETE RESTRICT,
          CONSTRAINT fk_attendants_company FOREIGN KEY (company_id)
              REFERENCES public.companies (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
        );
      `);
      console.log('Tabela de atendentes criada com sucesso!');
    }

    // Criar tabela de especialidades se não existir
    if (!tabelas.some(t => t.table_name === 'specialties')) {
      console.log('Criando tabela de especialidades...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.specialties (
          id UUID NOT NULL,
          name VARCHAR(150) NOT NULL,
          description TEXT NOT NULL,
          company_id UUID NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_specialties PRIMARY KEY (id),
          CONSTRAINT fk_specialties_company FOREIGN KEY (company_id)
              REFERENCES public.companies (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
        );
      `);
      console.log('Tabela de especialidades criada com sucesso!');
    }

    // Criar tabela de agendamentos se não existir
    if (!tabelas.some(t => t.table_name === 'appointments')) {
      console.log('Criando tabela de agendamentos...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.appointments (
          id UUID NOT NULL,
          client_id UUID NOT NULL,
          company_id UUID NOT NULL,
          attendant_id UUID NOT NULL,
          appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
          service_performed BOOLEAN NOT NULL DEFAULT FALSE,
          notes TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_appointments PRIMARY KEY (id),
          CONSTRAINT fk_appointments_client FOREIGN KEY (client_id)
              REFERENCES public.clients (id)
              ON UPDATE CASCADE
              ON DELETE RESTRICT,
          CONSTRAINT fk_appointments_company FOREIGN KEY (company_id)
              REFERENCES public.companies (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE,
          CONSTRAINT fk_appointments_attendant FOREIGN KEY (attendant_id)
              REFERENCES public.attendants (id)
              ON UPDATE CASCADE
              ON DELETE RESTRICT
        );
      `);
      console.log('Tabela de agendamentos criada com sucesso!');
    }

    // Criar tabela de horários se não existir
    if (!tabelas.some(t => t.table_name === 'schedules')) {
      console.log('Criando tabela de horários...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.schedules (
          id UUID NOT NULL,
          attendant_id UUID NOT NULL,
          day_of_week VARCHAR(20) NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_schedules PRIMARY KEY (id),
          CONSTRAINT fk_schedules_attendant FOREIGN KEY (attendant_id)
              REFERENCES public.attendants (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
        );
      `);
      console.log('Tabela de horários criada com sucesso!');
    }

    // Criar tabela de configuração se não existir
    if (!tabelas.some(t => t.table_name === 'config')) {
      console.log('Criando tabela de configuração...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.config(
          id UUID NOT NULL,
          company_id UUID NOT NULL,
          logo_url TEXT,
          evolution_url TEXT,
          evolution_key TEXT,
          evolution_instance TEXT,
          minio_bucket TEXT,
          minio_port TEXT,
          minio_access_key TEXT,
          minio_secret_key TEXT,
          minio_endpoint TEXT,
          email TEXT,
          email_password TEXT,
          email_smtp TEXT,
          email_port TEXT,
          email_text_scheduled TEXT,
          email_text_canceled TEXT,
          email_text_confirmed TEXT,
          email_text_rejected TEXT,
          ai_provider TEXT DEFAULT 'openai',
          ai_api_key TEXT,
          ai_model TEXT DEFAULT 'gpt-3.5-turbo',
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_config PRIMARY KEY (id),
          CONSTRAINT fk_config_company FOREIGN KEY (company_id)
              REFERENCES public.companies (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
        );
      `);
      console.log('Tabela de configuração criada com sucesso!');
    }

    // Criar tabela de clientes_companies se não existir
    if (!tabelas.some(t => t.table_name === 'clients_companies')) {
      console.log('Criando tabela de clientes_companies...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.clients_companies (
          client_id UUID NOT NULL,
          company_id UUID NOT NULL,
          registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT pk_clients_companies PRIMARY KEY (client_id, company_id),
          CONSTRAINT fk_clients_companies_client FOREIGN KEY (client_id)
              REFERENCES public.clients (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE,
          CONSTRAINT fk_clients_companies_company FOREIGN KEY (company_id)
              REFERENCES public.companies (id)
              ON UPDATE CASCADE
              ON DELETE CASCADE
        );
      `);
      console.log('Tabela de clientes_companies criada com sucesso!');
    }

    console.log('Processo de correção concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao corrigir rotas:', error);
    process.exit(1);
  }
}

corrigirRotas();
