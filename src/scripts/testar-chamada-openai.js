/**
 * Script para testar a chamada à API da OpenAI diretamente
 */

const axios = require('axios');

async function testarChamadaOpenAI() {
  try {
    console.log('Testando chamada à API da OpenAI...');
    
    // Configuração de teste
    const config = {
      model: 'gpt-3.5-turbo',
      apiKey: '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', // Chave de teste
      temperature: 0.7,
      maxTokens: 1000
    };
    
    const prompt = 'Olá, como você está?';
    
    console.log('Configuração:', {
      model: config.model,
      apiKey: config.apiKey ? '******' : 'Não definido',
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });
    
    // Fazer a chamada à API
    console.log('Fazendo chamada à API...');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.model,
        messages: [
          { role: 'system', content: 'Você é um assistente de agendamento inteligente.' },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );
    
    console.log('Resposta recebida:', response.data);
    
  } catch (error) {
    console.error('Erro ao chamar OpenAI:');
    
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que acionou um erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    console.error('Configuração da requisição:', error.config);
  }
}

// Executar o teste
testarChamadaOpenAI();
