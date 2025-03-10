const aiConfig = require('../config/aiConfig');
const axios = require('axios');
const { Company } = require('../models');

class AIService {
    constructor() {
        this.defaultConfig = aiConfig;
    }

    async processarSolicitacao(mensagem, apiKey) {
        try {
            // Busca a empresa pela API key
            const empresa = await Company.findOne({ where: { apiKey } });
            if (!empresa) {
                throw new Error('Empresa não encontrada');
            }

            // Usa as configurações da empresa ou as padrões do .env
            const config = {
                provider: empresa.aiProvider || this.defaultConfig.provider,
                apiKey: empresa.aiApiKey || this.defaultConfig.apiKey,
                model: empresa.aiModel || this.defaultConfig.model,
                temperature: this.defaultConfig.temperature,
                maxTokens: this.defaultConfig.maxTokens
            };

            const agora = new Date();
            const prompt = `
            Você é um assistente especializado em interpretar solicitações de agendamento.
            O horário é relativo a data e hora atual: ${agora.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}.
            Analise a seguinte solicitação e extraia as informações relevantes:
            "${mensagem}"
            
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

            let response;
            
            switch (config.provider) {
                case 'openai':
                    response = await this.chamarOpenAI(prompt, config);
                    break;
                case 'anthropic':
                    response = await this.chamarAnthropic(prompt, config);
                    break;
                case 'google':
                    response = await this.chamarGoogleAI(prompt, config);
                    break;
                default:
                    throw new Error('Provedor de IA não suportado');
            }

            return response;
        } catch (error) {
            console.error('Erro ao processar solicitação:', error);
            throw error;
        }
    }

    async chamarOpenAI(prompt, config) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: config.temperature,
                max_tokens: config.maxTokens
            }, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            throw new Error(`Erro na chamada OpenAI: ${error.message}`);
        }
    }

    async chamarAnthropic(prompt, config) {
        try {
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: config.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: config.maxTokens
            }, {
                headers: {
                    'x-api-key': config.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.content[0].text;
        } catch (error) {
            throw new Error(`Erro na chamada Anthropic: ${error.message}`);
        }
    }

    async chamarGoogleAI(prompt, config) {
        try {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/${config.model}:generateContent`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            throw new Error(`Erro na chamada Google AI: ${error.message}`);
        }
    }
}

module.exports = new AIService();
