/**
 * Script para adicionar campos adicionais de IA à tabela config
 * Adicionando temperatura e prompt personalizado para cada empresa
 */

require('dotenv').config();
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
  host: '185.217.127.77',
  port: 5432,
  database: 'agendero',
  user: 'postgres',
  password: '984011c5ca123ee9060092a2af946367'
});

async function updateAIFields() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando adição de campos adicionais de IA na tabela config...');
    
    // Iniciar transação
    await client.query('BEGIN');
    
    // Verificar e adicionar coluna ai_temperature
    const checkAiTemperature = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='config' AND column_name='ai_temperature'
    `);
    
    if (checkAiTemperature.rows.length === 0) {
      console.log('Adicionando coluna ai_temperature...');
      await client.query(`
        ALTER TABLE public.config 
        ADD COLUMN ai_temperature DECIMAL(3,2) DEFAULT 0.7
      `);
    } else {
      console.log('Coluna ai_temperature já existe.');
    }
    
    // Verificar e adicionar coluna ai_prompt
    const checkAiPrompt = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='config' AND column_name='ai_prompt'
    `);
    
    if (checkAiPrompt.rows.length === 0) {
      console.log('Adicionando coluna ai_prompt...');
      await client.query(`
        ALTER TABLE public.config 
        ADD COLUMN ai_prompt TEXT
      `);
    } else {
      console.log('Coluna ai_prompt já existe.');
    }
    
    // Atualizar configurações existentes com valores padrão
    console.log('Atualizando registros existentes com valores padrão...');
    
    const defaultPrompt = `Você é um assistente especializado em interpretar solicitações de agendamento.
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
5. Caso não seja informada a data mas seja informado o horário, então use a data atual como base.`;
    
    await client.query(`
      UPDATE public.config
      SET 
          ai_temperature = COALESCE(ai_temperature, 0.7),
          ai_prompt = COALESCE(ai_prompt, $1)
    `, [defaultPrompt]);
    
    // Confirmar transação
    await client.query('COMMIT');
    
    // Exibir as colunas da tabela para verificação
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'config' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstrutura atual da tabela config:');
    columns.rows.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });
    
    console.log('\nAtualização concluída com sucesso!');
    
  } catch (error) {
    // Reverter em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar a tabela config:', error);
  } finally {
    // Liberar o cliente
    client.release();
    // Encerrar o pool de conexões
    await pool.end();
  }
}

// Executar a função de atualização
updateAIFields();
