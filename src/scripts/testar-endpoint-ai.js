/**
 * Script para testar o endpoint de processamento de IA
 */

const axios = require('axios');

// Configuração
const API_URL = 'http://localhost:3002/api/ai-agendamento/processar';
const API_KEY = 'df739816-3ac6-4994-99bc-348df6b298bd'; // Use a chave API gerada anteriormente

// Dados para teste
const dadosTeste = {
  mensagem: "Olá, gostaria de agendar uma consulta com o Dr. Silva para amanhã às 14h. Meu nome é João e meu email é joao@exemplo.com"
};

async function testarEndpoint() {
  try {
    console.log('Testando endpoint de processamento de IA...');
    console.log(`URL: ${API_URL}`);
    console.log(`Chave API: ${API_KEY}`);
    console.log('Dados:', JSON.stringify(dadosTeste, null, 2));
    
    const resposta = await axios.post(API_URL, dadosTeste, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    
    console.log('\n=== RESPOSTA ===');
    console.log('Status:', resposta.status);
    console.log('Dados:', JSON.stringify(resposta.data, null, 2));
  } catch (error) {
    console.error('\n=== ERRO ===');
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o servidor está rodando.');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro:', error.message);
    }
  }
}

// Executar o teste
testarEndpoint();
