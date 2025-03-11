/**
 * Serviço para gerenciar configurações de IA específicas para cada empresa
 * Implementa o padrão multi-tenant para configurações de IA
 */

const Config = require('../models/config');
const { sequelize } = require('../models');

class AIConfigService {
    /**
     * Obtém as configurações de IA para uma empresa específica
     * @param {string} empresaId - ID da empresa
     * @returns {Promise<Object>} Configurações de IA da empresa
     */
    static async getAIConfigForEmpresa(empresaId) {
        try {
            console.log(`Buscando configurações de IA para empresa ID: ${empresaId}`);
            
            // Buscar configurações da empresa no banco de dados
            const config = await Config.getByEmpresaId(empresaId);
            
            if (!config) {
                console.warn(`Configurações de IA não encontradas para empresa ${empresaId}`);
                
                // Buscar diretamente da tabela empresas como fallback
                const empresas = await sequelize.query(
                    `SELECT ai_provider, ai_api_key, ai_model FROM empresas WHERE id = $1`,
                    {
                        bind: [empresaId],
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                
                if (empresas && empresas.length > 0) {
                    const empresa = empresas[0];
                    console.log(`Usando configurações de IA da tabela empresas: ${JSON.stringify(empresa)}`);
                    
                    return {
                        provider: empresa.ai_provider || 'openai',
                        apiKey: empresa.ai_api_key || '',
                        model: empresa.ai_model || 'gpt-3.5-turbo',
                        temperature: 0.7,
                        prompt: this.getDefaultPrompt()
                    };
                }
                
                return this.getDefaultAIConfig();
            }
            
            console.log(`Configurações de IA encontradas: ${JSON.stringify(config)}`);
            
            // Retornar as configurações de IA específicas da empresa
            return {
                provider: config.ai_provider || 'openai',
                apiKey: config.ai_api_key || '',
                model: config.ai_model || 'gpt-3.5-turbo',
                temperature: config.ai_temperature || 0.7,
                prompt: config.ai_prompt || this.getDefaultPrompt()
            };
        } catch (error) {
            console.error('Erro ao obter configurações de IA:', error);
            return this.getDefaultAIConfig();
        }
    }
    
    /**
     * Atualiza as configurações de IA para uma empresa específica
     * @param {string} empresaId - ID da empresa
     * @param {Object} aiConfig - Novas configurações de IA
     * @returns {Promise<Object>} Configurações atualizadas
     */
    static async updateAIConfigForEmpresa(empresaId, aiConfig) {
        try {
            // Buscar configuração existente
            let config = await Config.getByEmpresaId(empresaId);
            
            if (!config) {
                throw new Error(`Configuração não encontrada para empresa ${empresaId}`);
            }
            
            // Atualizar apenas os campos de IA
            const updatedConfig = await Config.update(config.id, {
                ...config,
                ai_provider: aiConfig.provider,
                ai_api_key: aiConfig.apiKey,
                ai_model: aiConfig.model,
                ai_temperature: aiConfig.temperature,
                ai_prompt: aiConfig.prompt
            });
            
            return {
                provider: updatedConfig.ai_provider,
                apiKey: updatedConfig.ai_api_key ? '********' : '', // Não retornar a chave real por segurança
                model: updatedConfig.ai_model,
                temperature: updatedConfig.ai_temperature,
                prompt: updatedConfig.ai_prompt ? 
                    (updatedConfig.ai_prompt.length > 50 ? 
                        updatedConfig.ai_prompt.substring(0, 50) + '...' : 
                        updatedConfig.ai_prompt) : 
                    null
            };
        } catch (error) {
            console.error('Erro ao atualizar configurações de IA:', error);
            throw error;
        }
    }
    
    /**
     * Retorna configurações padrão de IA
     * @returns {Object} Configurações padrão
     */
    static getDefaultAIConfig() {
        return {
            provider: 'openai',
            apiKey: '',
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            prompt: this.getDefaultPrompt()
        };
    }
    
    /**
     * Retorna o prompt padrão para processamento de agendamentos
     * @returns {string} Prompt padrão
     */
    static getDefaultPrompt() {
        return `Você é um assistente especializado em interpretar solicitações de agendamento.
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
    }
}

module.exports = AIConfigService;
