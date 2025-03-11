/**
 * Script para criar uma empresa de teste com chave API
 */

const { sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function criarEmpresaTeste() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Gerar IDs e chave API
    const empresaId = uuidv4();
    const chaveAPI = uuidv4();
    const configId = uuidv4();
    const dataAtual = new Date().toISOString();
    
    // Criar empresa diretamente via SQL
    await sequelize.query(
      `INSERT INTO empresas (
        id, nome, atividade, responsavel, email, chave_api, ativa, data_cadastro, 
        ai_provider, ai_api_key, ai_model, "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )`,
      {
        bind: [
          empresaId,
          'Empresa Teste',
          'Consultório Médico',
          'Administrador Teste',
          'teste@exemplo.com',
          chaveAPI,
          true,
          dataAtual,
          'openai',
          '',
          'gpt-3.5-turbo',
          dataAtual,
          dataAtual
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );
    
    console.log('\n=== EMPRESA DE TESTE CRIADA ===');
    console.log(`ID: ${empresaId}`);
    console.log(`Nome: Empresa Teste`);
    console.log(`Chave API: ${chaveAPI}`);
    console.log('-------------------------------');
    console.log('Use esta chave API no header "x-api-key" para autenticar suas requisições no Postman.');
    
    // Criar configuração padrão para a empresa
    await sequelize.query(
      `INSERT INTO config (id, empresa_id, ai_provider, ai_api_key, ai_model, ai_temperature, ai_prompt)
       VALUES ($1, $2, 'openai', '', 'gpt-3.5-turbo', 0.7, $3)`,
      {
        bind: [
          configId,
          empresaId,
          `Você é um assistente especializado em interpretar solicitações de agendamento.
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
5. Caso não seja informada a data mas seja informado o horário, então use a data atual como base.`
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );
    
    console.log('\nConfiguração de IA criada para a empresa de teste.');
    
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  } catch (error) {
    console.error('Erro ao criar empresa de teste:', error);
  }
}

// Executar a função
criarEmpresaTeste();
