
CREATE TABLE IF NOT EXISTS public.config(
    id UUID NOT NULL,
    logo_url TEXT COLLATE pg_catalog."default",
    evolution_url TEXT COLLATE pg_catalog."default",
    evolution_key TEXT COLLATE pg_catalog."default",
    evolution_instancia TEXT COLLATE pg_catalog."default",
    minio_bucket TEXT COLLATE pg_catalog."default",
    minio_port TEXT COLLATE pg_catalog."default",
    minio_access_key TEXT COLLATE pg_catalog."default",
    minio_secret_key TEXT COLLATE pg_catalog."default",
    minio_endpoint TEXT COLLATE pg_catalog."default",
    email TEXT COLLATE pg_catalog."default",
    email_senha TEXT COLLATE pg_catalog."default",
    email_smtp TEXT COLLATE pg_catalog."default",
    email_porta TEXT COLLATE pg_catalog."default",
    email_texto_agendado TEXT COLLATE pg_catalog."default",
    email_texto_cancelado TEXT COLLATE pg_catalog."default",
    email_texto_confirmado TEXT COLLATE pg_catalog."default",
    email_texto_recusado TEXT COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID NOT NULL,
    cliente_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    atendente_id UUID NOT NULL,
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    servico_realizado BOOLEAN NOT NULL,
    CONSTRAINT pk_agendamentos PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.atendentes (
    id UUID NOT NULL,
    nome VARCHAR(100) COLLATE pg_catalog."default" NOT NULL,
    especialidade_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    telefone_celular TEXT COLLATE pg_catalog."default" NOT NULL,
    email VARCHAR(255) COLLATE pg_catalog."default" NOT NULL,
    data_contratacao TIMESTAMP WITH TIME ZONE NOT NULL,
    administrador BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_atendentes PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID NOT NULL, 
    nome TEXT COLLATE pg_catalog."default" NOT NULL,    
    atividade TEXT COLLATE pg_catalog."default" NOT NULL,
    responsavel TEXT COLLATE pg_catalog."default" NOT NULL,
    endereco_rua TEXT COLLATE pg_catalog."default",
    endereco_cidade TEXT COLLATE pg_catalog."default",
    endereco_estado TEXT COLLATE pg_catalog."default",
    endereco_bairro TEXT COLLATE pg_catalog."default",
    endereco_cep TEXT COLLATE pg_catalog."default",
    endereco_pais TEXT COLLATE pg_catalog."default",
    endereco_complemento TEXT COLLATE pg_catalog."default",
    endereco_numero TEXT COLLATE pg_catalog."default",
    telefone_fixo TEXT COLLATE pg_catalog."default",
    telefone_celular TEXT COLLATE pg_catalog."default",
    email TEXT COLLATE pg_catalog."default",
    logo TEXT COLLATE pg_catalog."default",
    ativa BOOLEAN NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL,
    chave_api UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    CONSTRAINT pk_empresas PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.clientes_empresas (
    cliente_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    CONSTRAINT pk_clientes_empresas PRIMARY KEY (cliente_id, empresa_id)
);

CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID NOT NULL PRIMARY KEY,
    nome VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    data_nascimento DATE,
    telefone_celular TEXT COLLATE pg_catalog."default" NOT NULL,
    email VARCHAR(255) COLLATE pg_catalog."default" UNIQUE,
    endereco_rua TEXT COLLATE pg_catalog."default",
    endereco_cidade TEXT COLLATE pg_catalog."default",
    endereco_estado TEXT COLLATE pg_catalog."default",
    endereco_bairro TEXT COLLATE pg_catalog."default",
    endereco_cep TEXT COLLATE pg_catalog."default",
    endereco_pais TEXT COLLATE pg_catalog."default",
    endereco_complemento TEXT COLLATE pg_catalog."default",
    endereco_numero TEXT COLLATE pg_catalog."default",
    observacoes TEXT COLLATE pg_catalog."default",
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    senha TEXT COLLATE pg_catalog."default" NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.horarios (
    id UUID NOT NULL,
    atendente_id UUID NOT NULL,
    dia_semana TEXT COLLATE pg_catalog."default" NOT NULL,
    hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_horarios PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.especialidades (
    id UUID NOT NULL,
    nome TEXT COLLATE pg_catalog."default" NOT NULL,
    descricao TEXT COLLATE pg_catalog."default" NOT NULL,
    empresa_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    CONSTRAINT pk_especialidades PRIMARY KEY (id)
);
