/**
 * Service to manage AI configurations for each company
 * Implements multi-tenant pattern for AI settings
 */

const { Config } = require('../models');

class AIConfigService {
    /**
     * Get AI configuration for a specific company
     * @param {string} companyId - Company ID
     * @returns {Promise<Object>} Company's AI configuration
     */
    static async getAIConfig(companyId) {
        try {
            console.log(`Fetching AI configuration for Company ID: ${companyId}`);
            
            const config = await Config.findOne({
                where: { company_id: companyId }
            });
            
            if (!config) {
                console.warn(`AI configuration not found for company ${companyId}`);
                return this.getDefaultAIConfig();
            }
            
            console.log(`AI configuration found: ${JSON.stringify(config)}`);
            
            return {
                provider: config.ai_provider || 'openai',
                apiKey: config.ai_api_key || '',
                model: config.ai_model || 'gpt-3.5-turbo',
                temperature: 0.7,
                prompt: this.getDefaultPrompt()
            };
        } catch (error) {
            console.error('Error fetching AI configuration:', error);
            return this.getDefaultAIConfig();
        }
    }
    
    /**
     * Update AI configuration for a specific company
     * @param {string} companyId - Company ID
     * @param {Object} aiConfig - New AI configuration
     * @returns {Promise<Object>} Updated configuration
     */
    static async updateAIConfig(companyId, aiConfig) {
        try {
            let [config, created] = await Config.findOrCreate({
                where: { company_id: companyId },
                defaults: {
                    ai_provider: 'openai',
                    ai_model: 'gpt-3.5-turbo'
                }
            });
            
            const updatedConfig = await config.update({
                ai_provider: aiConfig.provider,
                ai_api_key: aiConfig.apiKey,
                ai_model: aiConfig.model
            });
            
            return {
                provider: updatedConfig.ai_provider,
                apiKey: updatedConfig.ai_api_key ? '********' : '',
                model: updatedConfig.ai_model
            };
        } catch (error) {
            console.error('Error updating AI configuration:', error);
            throw error;
        }
    }
    
    /**
     * Returns default AI configuration
     * @returns {Object} Default configuration
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
     * Returns default prompt for appointment processing
     * @returns {string} Default prompt
     */
    static getDefaultPrompt() {
        return `You are an assistant specialized in interpreting scheduling requests.
The time is relative to current date and time: {CURRENT_DATETIME}.
Analyze the following request and extract relevant information:
"{MESSAGE}"

IMPORTANT:
1. If client email is not provided in the message, return:
{
    "success": false,
    "message": "Please provide client email to proceed with the request."
}
2. The attendant might be referred to as doctor, dr, dr., dentist, attendant, seller, etc. Remove these prefixes from the attendant name.
3. Remove any professional titles like "Dr.", "Prof.", "Mr.", "Mrs.", "Ms.", etc.
4. Otherwise, return ONLY a valid JSON object with the following information, without any additional text or markdown formatting:
{
    "action": "schedule|cancel|change|list",
    "client_name": string,
    "client_email": string,
    "attendant_name": string (optional),
    "date": string (YYYY-MM-DD),
    "time": string (HH:mm) (optional)
}
5. If date is not provided but time is, use current date as base.`;
    }
}

module.exports = AIConfigService;