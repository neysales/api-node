-- Script para adicionar campos adicionais de IA à tabela config
-- Adicionando temperatura e prompt personalizado para cada empresa

-- Verificar se as colunas já existem antes de adicioná-las
DO $$
BEGIN
    -- Adicionar coluna ai_temperature se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='config' AND column_name='ai_temperature') THEN
        ALTER TABLE public.config 
        ADD COLUMN ai_temperature DECIMAL(3,2) DEFAULT 0.7;
    END IF;

    -- Adicionar coluna ai_prompt se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='config' AND column_name='ai_prompt') THEN
        ALTER TABLE public.config 
        ADD COLUMN ai_prompt TEXT;
    END IF;
END
$$;

-- Atualizar configurações existentes com valores padrão
UPDATE public.config
SET 
    ai_temperature = COALESCE(ai_temperature, 0.7),
    ai_prompt = COALESCE(ai_prompt, 
    'Você é um assistente especializado em interpretar solicitações de agendamento.
    O horário é relativo a data e hora atual: {DATA_HORA_ATUAL}.
    Analise a seguinte solicitação e extraia as informações relevantes:
    "{MENSAGEM}"
    
    IMPORTANTE: 
    1. Se o email do cliente não for fornecido na mensagem, retorne:
    {
        "sucesso": false,
        "mensagem": "Por favor, informe o email do cliente para prosseguir com a solicitação."
    }
    2. O atendente pode ser chamado de médico, médica, dr, dr., dra, dra., doutor, doutora, dentista, atendente, vendedor, vendedora, etc. Então remova esses prefixos do nome do atendente.
    3. Remova qualquer título profissional como "Dr.", "Dra.", "Prof.", "Sr.", "Sra.", "Srta.", entre outros.
    4. Caso contrário, retorne APENAS um objeto JSON válido com as seguintes informações, sem nenhum texto adicional ou formatação markdown:
    {
        "acao": "agendar|cancelar|alterar|listar",
        "nome_cliente": string,
        "email_cliente": string,
        "nome_atendente": string (opcional),
        "data": string (YYYY-MM-DD),
        "hora": string (HH:mm) (opcional)
    }
    5. Caso não seja informada a data mas seja informado o horário, então use a data atual como base.');

-- Exibir as colunas atualizadas para verificação
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'config' 
ORDER BY ordinal_position;
