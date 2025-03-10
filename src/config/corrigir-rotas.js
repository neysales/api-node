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

    // Criar tabela de empresas se não existir
    if (!tabelas.some(t => t.table_name === 'empresas')) {
      console.log('Criando tabela de empresas...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.empresas (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          atividade VARCHAR(100) NOT NULL,
          responsavel VARCHAR(100) NOT NULL,
          telefone_celular VARCHAR(20) NOT NULL,
          chave_api VARCHAR(100) NOT NULL,
          ativa BOOLEAN NOT NULL DEFAULT TRUE,
          ai_provider TEXT,
          ai_api_key TEXT,
          ai_model TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de empresas criada com sucesso!');
    }

    // Verificar se a empresa com a API key já existe
    const apiKey = process.env.Authentication__ApiKey;
    const [empresas] = await sequelize.query(
      `SELECT id, nome FROM empresas WHERE chave_api = '${apiKey}'`
    );

    if (empresas.length === 0) {
      console.log('Criando empresa com a API key configurada...');
      await sequelize.query(`
        INSERT INTO empresas (
          nome, 
          atividade, 
          responsavel, 
          telefone_celular, 
          chave_api, 
          ativa, 
          ai_provider, 
          ai_api_key, 
          ai_model,
          "createdAt",
          "updatedAt"
        ) VALUES (
          'Empresa Teste', 
          'Serviços', 
          'Administrador', 
          '(11) 99999-9999', 
          '${apiKey}', 
          true, 
          'openai', 
          '${process.env.AI_API_KEY || ''}', 
          '${process.env.AI_MODEL || 'gpt-3.5-turbo'}',
          NOW(),
          NOW()
        );
      `);
      console.log('Empresa criada com sucesso!');
    } else {
      console.log('Empresa já existe:', empresas[0]);
    }

    // Criar tabela de clientes se não existir
    if (!tabelas.some(t => t.table_name === 'clientes')) {
      console.log('Criando tabela de clientes...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.clientes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          telefone VARCHAR(20) NOT NULL,
          email VARCHAR(100),
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          ativo BOOLEAN NOT NULL DEFAULT TRUE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de clientes criada com sucesso!');
    }

    // Criar tabela de atendentes se não existir
    if (!tabelas.some(t => t.table_name === 'atendentes')) {
      console.log('Criando tabela de atendentes...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.atendentes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          telefone VARCHAR(20) NOT NULL,
          email VARCHAR(100),
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          ativo BOOLEAN NOT NULL DEFAULT TRUE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de atendentes criada com sucesso!');
    }

    // Criar tabela de especialidades se não existir
    if (!tabelas.some(t => t.table_name === 'especialidades')) {
      console.log('Criando tabela de especialidades...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.especialidades (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          descricao TEXT,
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de especialidades criada com sucesso!');
    }

    // Criar tabela de agendamentos se não existir
    if (!tabelas.some(t => t.table_name === 'agendamentos')) {
      console.log('Criando tabela de agendamentos...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.agendamentos (
          id SERIAL PRIMARY KEY,
          cliente_id INTEGER NOT NULL REFERENCES clientes(id),
          atendente_id INTEGER NOT NULL REFERENCES atendentes(id),
          especialidade_id INTEGER NOT NULL REFERENCES especialidades(id),
          data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
          observacoes TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'agendado',
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de agendamentos criada com sucesso!');
    }

    // Criar tabela de horários se não existir
    if (!tabelas.some(t => t.table_name === 'horarios')) {
      console.log('Criando tabela de horários...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.horarios (
          id SERIAL PRIMARY KEY,
          atendente_id INTEGER NOT NULL REFERENCES atendentes(id),
          dia_semana INTEGER NOT NULL,
          hora_inicio TIME NOT NULL,
          hora_fim TIME NOT NULL,
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de horários criada com sucesso!');
    }

    console.log('Processo de correção concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao corrigir rotas:', error);
    process.exit(1);
  }
}

corrigirRotas();
