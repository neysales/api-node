const axios = require('axios');
const { Company } = require('../models');
const AIConfigService = require('./aiConfigService');
const aiConfig = require('../config/aiConfig');
const { sequelize } = require('../models');

class AIService {
    constructor() {
        this.defaultConfig = aiConfig;
    }

    async processarSolicitacao(mensagem, apiKey) {
        try {
            console.log('Processando solicitação com API key:', apiKey);
            
            // Busca a empresa pela API key usando a consulta SQL direta
            const empresas = await sequelize.query(
                `SELECT * FROM empresas WHERE chave_api = $1 AND ativa = true`,
                {
                    bind: [apiKey],
                    type: sequelize.QueryTypes.SELECT
                }
            );
            
            if (!empresas || empresas.length === 0) {
                throw new Error('Empresa não encontrada para a chave de API fornecida');
            }
            
            const empresa = empresas[0];
            console.log('Empresa encontrada:', empresa.id, empresa.nome);

            // Busca as configurações de IA do banco de dados usando o AIConfigService
            const aiConfigFromDB = await AIConfigService.getAIConfigForEmpresa(empresa.id);
            
            // Usa as configurações da empresa do banco de dados
            const config = {
                provider: aiConfigFromDB.provider || empresa.ai_provider || this.defaultConfig.provider,
                apiKey: aiConfigFromDB.apiKey || empresa.ai_api_key || this.defaultConfig.apiKey,
                model: aiConfigFromDB.model || empresa.ai_model || this.defaultConfig.model,
                temperature: aiConfigFromDB.temperature || this.defaultConfig.temperature,
                maxTokens: this.defaultConfig.maxTokens
            };
            
            // Se não houver chave de API configurada, usa a do .env como fallback
            if (!config.apiKey) {
                config.apiKey = this.defaultConfig.apiKey;
                console.warn(`Empresa ${empresa.id} não possui chave de API configurada. Usando chave padrão do .env.`);
            }

            const agora = new Date();
            
            // Usa o prompt personalizado do banco de dados ou o padrão se não existir
            let prompt = aiConfigFromDB.prompt || this.getDefaultPrompt();
            
            // Substitui as variáveis no prompt
            prompt = prompt
                .replace('{DATA_HORA_ATUAL}', agora.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' }))
                .replace('{MENSAGEM}', mensagem);

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
                    // Padrão para OpenAI se nenhum provedor válido for especificado
                    console.warn(`Provedor '${config.provider}' não reconhecido. Usando OpenAI como padrão.`);
                    response = await this.chamarOpenAI(prompt, config);
            }
            
            return response;
        } catch (error) {
            console.error('Erro ao processar solicitação de IA:', error);
            return JSON.stringify({
                sucesso: false,
                mensagem: 'Erro ao processar solicitação',
                erro: error.message
            });
        }
    }

    getDefaultPrompt() {
        return `
        Você é um assistente de agendamento inteligente. 
        Data e hora atual: {DATA_HORA_ATUAL}
        
        Analise a mensagem do cliente abaixo e extraia as informações relevantes para agendamento:
        
        "{MENSAGEM}"
        
        Responda APENAS com um JSON no seguinte formato:
        {
            "sucesso": true/false,
            "acao": "agendar/cancelar/alterar/listar",
            "nome_cliente": "Nome do cliente",
            "email_cliente": "Email do cliente (se disponível)",
            "telefone_cliente": "Telefone do cliente (se disponível)",
            "nome_atendente": "Nome do profissional solicitado (se especificado)",
            "data": "YYYY-MM-DD",
            "hora": "HH:MM",
            "observacoes": "Quaisquer observações adicionais"
        }
        
        Se não for possível extrair as informações necessárias, retorne:
        {
            "sucesso": false,
            "mensagem": "Explicação do problema"
        }
        `;
    }

    async chamarOpenAI(prompt, config) {
        try {
            // Converter os valores para os tipos corretos
            const temperature = parseFloat(config.temperature || 0.7);
            const maxTokens = parseInt(config.maxTokens || 2000);
            
            console.log('Chamando OpenAI com configuração:', {
                model: config.model,
                temperature: temperature,
                max_tokens: maxTokens
            });
            
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: config.model,
                    messages: [
                        { role: "system", content: "Você é um assistente de agendamento inteligente." },
                        { role: "user", content: prompt }
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${config.apiKey}`
                    }
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Erro ao chamar OpenAI:', error);
            if (error.response) {
                console.error('Detalhes do erro:', error.response.data);
            }
            throw new Error(`Erro ao chamar OpenAI: ${error.message}`);
        }
    }

    async chamarAnthropic(prompt, config) {
        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: config.model || 'claude-3-opus-20240229',
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: config.maxTokens
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': config.apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            return response.data.content[0].text;
        } catch (error) {
            console.error('Erro ao chamar Anthropic:', error);
            throw new Error(`Erro ao chamar Anthropic: ${error.message}`);
        }
    }

    async chamarGoogleAI(prompt, config) {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent`,
                {
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: config.temperature,
                        maxOutputTokens: config.maxTokens
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        key: config.apiKey
                    }
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Erro ao chamar Google AI:', error);
            throw new Error(`Erro ao chamar Google AI: ${error.message}`);
        }
    }
}

module.exports = new AIService();
