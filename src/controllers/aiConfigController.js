/**
 * Controlador para gerenciar configurações de IA específicas para cada empresa
 */

const AIConfigService = require('../services/aiConfigService');

/**
 * Obtém as configurações de IA da empresa atual
 */
const getAIConfig = async (req, res) => {
    try {
        // Obter ID da empresa a partir do middleware de autenticação
        const empresaId = req.company.id;
        
        // Buscar configurações de IA para a empresa
        const aiConfig = await AIConfigService.getAIConfigForEmpresa(empresaId);
        
        // Não retornar a chave de API completa por segurança
        if (aiConfig.apiKey) {
            aiConfig.apiKey = '********';
        }
        
        res.json({
            success: true,
            message: 'Configurações de IA obtidas com sucesso',
            config: aiConfig
        });
    } catch (error) {
        console.error('Erro ao obter configurações de IA:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter configurações de IA',
            error: error.message
        });
    }
};

/**
 * Atualiza as configurações de IA da empresa atual
 */
const updateAIConfig = async (req, res) => {
    try {
        // Obter ID da empresa a partir do middleware de autenticação
        const empresaId = req.company.id;
        
        // Validar dados de entrada
        const { provider, apiKey, model, temperature, prompt } = req.body;
        
        if (!provider || !model) {
            return res.status(400).json({
                success: false,
                message: 'Provedor e modelo de IA são obrigatórios'
            });
        }
        
        // Validar temperatura (deve ser um número entre 0 e 1)
        const tempValue = parseFloat(temperature);
        if (temperature !== undefined && (isNaN(tempValue) || tempValue < 0 || tempValue > 1)) {
            return res.status(400).json({
                success: false,
                message: 'Temperatura deve ser um número entre 0 e 1'
            });
        }
        
        // Atualizar configurações de IA
        const aiConfig = await AIConfigService.updateAIConfigForEmpresa(empresaId, {
            provider,
            apiKey,
            model,
            temperature: tempValue,
            prompt
        });
        
        res.json({
            success: true,
            message: 'Configurações de IA atualizadas com sucesso',
            config: aiConfig
        });
    } catch (error) {
        console.error('Erro ao atualizar configurações de IA:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar configurações de IA',
            error: error.message
        });
    }
};

module.exports = {
    getAIConfig,
    updateAIConfig
};
