const axios = require('axios');
const { Company, Config } = require('../models');
const AIConfigService = require('./aiConfigService');
const aiConfig = require('../config/aiConfig');

class AIService {
    constructor() {
        this.defaultConfig = aiConfig;
    }

    async processRequest(message, apiKey) {
        try {
            console.log('Processing request with API key:', apiKey);
            
            // Find company using model instead of raw SQL
            const company = await Company.findOne({
                where: { 
                    api_key: apiKey,
                    active: true
                },
                include: [{
                    model: Config,
                    as: 'config'
                }]
            });
            
            if (!company) {
                throw new Error('Company not found for provided API key');
            }
            
            console.log('Company found:', company.id, company.name);

            // Get AI config from related Config model
            const aiConfigFromDB = await AIConfigService.getAIConfig(company.id);
            
            // Use company's configuration from Config table
            const config = {
                provider: aiConfigFromDB.provider || this.defaultConfig.provider,
                apiKey: aiConfigFromDB.apiKey || this.defaultConfig.apiKey,
                model: aiConfigFromDB.model || this.defaultConfig.model,
                temperature: aiConfigFromDB.temperature || this.defaultConfig.temperature,
                maxTokens: this.defaultConfig.maxTokens
            };
            
            if (!config.apiKey) {
                config.apiKey = this.defaultConfig.apiKey;
                console.warn(`Company ${company.id} has no API key configured. Using default from .env`);
            }

            const now = new Date();
            
            // Use custom prompt from config or default
            let prompt = aiConfigFromDB.prompt || this.getDefaultPrompt();
            
            // Replace variables in prompt
            prompt = prompt
                .replace('{CURRENT_DATETIME}', now.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }))
                .replace('{MESSAGE}', message);

            let response;
            
            switch (config.provider) {
                case 'openai':
                    response = await this.callOpenAI(prompt, config);
                    break;
                case 'anthropic':
                    response = await this.callAnthropic(prompt, config);
                    break;
                case 'google':
                    response = await this.callGoogleAI(prompt, config);
                    break;
                default:
                    console.warn(`Provider '${config.provider}' not recognized. Using OpenAI as default.`);
                    response = await this.callOpenAI(prompt, config);
            }
            
            return response;
        } catch (error) {
            console.error('Error processing AI request:', error);
            return JSON.stringify({
                success: false,
                message: 'Error processing request',
                error: error.message
            });
        }
    }

    getDefaultPrompt() {
        return `
        You are an intelligent scheduling assistant.
        Current date and time: {CURRENT_DATETIME}
        
        Analyze the client's message below and extract relevant scheduling information:
        
        "{MESSAGE}"
        
        Respond ONLY with a JSON in the following format:
        {
            "success": true/false,
            "action": "schedule/cancel/change/list",
            "client_name": "Client name",
            "client_email": "Client email (if available)",
            "client_phone": "Client phone (if available)",
            "attendant_name": "Requested professional (if specified)",
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "notes": "Any additional observations"
        }
        
        If unable to extract necessary information, return:
        {
            "success": false,
            "message": "Problem explanation"
        }
        `;
    }

    async callOpenAI(prompt, config) {
        try {
            // Convert values to correct types
            const temperature = parseFloat(config.temperature || 0.7);
            const maxTokens = parseInt(config.maxTokens || 2000);
            
            console.log('Calling OpenAI with configuration:', {
                model: config.model,
                temperature: temperature,
                max_tokens: maxTokens
            });
            
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: config.model,
                    messages: [
                        { role: "system", content: "You are an intelligent scheduling assistant." },
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
            console.error('Error calling OpenAI:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
            throw new Error(`Error calling OpenAI: ${error.message}`);
        }
    }

    async callAnthropic(prompt, config) {
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
            console.error('Error calling Anthropic:', error);
            throw new Error(`Error calling Anthropic: ${error.message}`);
        }
    }

    async callGoogleAI(prompt, config) {
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
            console.error('Error calling Google AI:', error);
            throw new Error(`Error calling Google AI: ${error.message}`);
        }
    }
}

module.exports = new AIService();
