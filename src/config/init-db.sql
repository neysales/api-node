
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID NOT NULL, 
    nome VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,    
    atividade VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    responsavel VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
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
    telefone_whatsapp TEXT COLLATE pg_catalog."default",
    email VARCHAR(255) COLLATE pg_catalog."default",
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    chave_api UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    CONSTRAINT pk_empresas PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.config(
    id UUID NOT NULL,
    empresa_id UUID NOT NULL,
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
    email_texto_recusado TEXT COLLATE pg_catalog."default",
    ai_provider TEXT COLLATE pg_catalog."default" DEFAULT 'openai',
    ai_api_key TEXT COLLATE pg_catalog."default",
    ai_model TEXT COLLATE pg_catalog."default" DEFAULT 'gpt-3.5-turbo',
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_config PRIMARY KEY (id),
    CONSTRAINT fk_config_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID NOT NULL,
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
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_clientes PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.clientes_empresas (
    cliente_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_clientes_empresas PRIMARY KEY (cliente_id, empresa_id),
    CONSTRAINT fk_clientes_empresas_cliente FOREIGN KEY (cliente_id)
        REFERENCES public.clientes (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_clientes_empresas_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.especialidades (
    id UUID NOT NULL,
    nome VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    descricao TEXT COLLATE pg_catalog."default" NOT NULL,
    empresa_id UUID NOT NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_especialidades PRIMARY KEY (id),
    CONSTRAINT fk_especialidades_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.atendentes (
    id UUID NOT NULL,
    nome VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    especialidade_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    telefone_celular TEXT COLLATE pg_catalog."default" NOT NULL,
    email VARCHAR(255) COLLATE pg_catalog."default" NOT NULL,
    data_contratacao TIMESTAMP WITH TIME ZONE NOT NULL,
    administrador BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_atendentes PRIMARY KEY (id),
    CONSTRAINT fk_atendentes_especialidade FOREIGN KEY (especialidade_id)
        REFERENCES public.especialidades (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_atendentes_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.horarios (
    id UUID NOT NULL,
    atendente_id UUID NOT NULL,
    dia_semana VARCHAR(20) COLLATE pg_catalog."default" NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_horarios PRIMARY KEY (id),
    CONSTRAINT fk_horarios_atendente FOREIGN KEY (atendente_id)
        REFERENCES public.atendentes (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID NOT NULL,
    cliente_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    atendente_id UUID NOT NULL,
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    servico_realizado BOOLEAN NOT NULL DEFAULT FALSE,
    observacoes TEXT COLLATE pg_catalog."default",
    status VARCHAR(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'agendado',
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_agendamentos PRIMARY KEY (id),
    CONSTRAINT fk_agendamentos_cliente FOREIGN KEY (cliente_id)
        REFERENCES public.clientes (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_agendamentos_empresa FOREIGN KEY (empresa_id)
        REFERENCES public.empresas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_agendamentos_atendente FOREIGN KEY (atendente_id)
        REFERENCES public.atendentes (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
