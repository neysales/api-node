-- Script para adicionar campos de IA à tabela config
-- Parte da migração para o modelo multi-tenant

-- Verificar se as colunas já existem antes de adicioná-las
DO $$
BEGIN
    -- Adicionar coluna ai_provider se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='config' AND column_name='ai_provider') THEN
        ALTER TABLE public.config 
        ADD COLUMN ai_provider TEXT COLLATE pg_catalog."default" DEFAULT 'openai';
    END IF;

    -- Adicionar coluna ai_api_key se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='config' AND column_name='ai_api_key') THEN
        ALTER TABLE public.config 
        ADD COLUMN ai_api_key TEXT COLLATE pg_catalog."default";
    END IF;

    -- Adicionar coluna ai_model se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='config' AND column_name='ai_model') THEN
        ALTER TABLE public.config 
        ADD COLUMN ai_model TEXT COLLATE pg_catalog."default" DEFAULT 'gpt-3.5-turbo';
    END IF;
END
$$;

-- Atualizar configurações existentes com valores padrão do .env
UPDATE public.config
SET 
    ai_provider = 'openai',
    ai_model = 'gpt-3.5-turbo'
WHERE ai_provider IS NULL OR ai_model IS NULL;

-- Exibir as colunas atualizadas para verificação
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'config' 
ORDER BY ordinal_position;
