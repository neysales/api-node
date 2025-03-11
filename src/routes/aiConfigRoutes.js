/**
 * Rotas para gerenciar configurações de IA específicas para cada empresa
 */

const express = require('express');
const router = express.Router();
const aiConfigController = require('../controllers/aiConfigController');

/**
 * @swagger
 * /api/ai-config:
 *   get:
 *     summary: Obtém as configurações de IA da empresa atual
 *     tags: [Configurações de IA]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Configurações de IA obtidas com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', aiConfigController.getAIConfig);

/**
 * @swagger
 * /api/ai-config:
 *   put:
 *     summary: Atualiza as configurações de IA da empresa atual
 *     tags: [Configurações de IA]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 description: Provedor de IA (openai, anthropic, google)
 *                 example: openai
 *               apiKey:
 *                 type: string
 *                 description: Chave de API do provedor de IA
 *                 example: sk-xxxxxxxxxxxxx
 *               model:
 *                 type: string
 *                 description: Modelo específico a ser usado
 *                 example: gpt-3.5-turbo
 *               temperature:
 *                 type: number
 *                 description: Temperatura para controle de criatividade (0 a 1)
 *                 example: 0.7
 *               prompt:
 *                 type: string
 *                 description: Prompt personalizado para processamento de agendamentos
 *                 example: "Você é um assistente especializado em interpretar solicitações de agendamento..."
 *     responses:
 *       200:
 *         description: Configurações de IA atualizadas com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/', aiConfigController.updateAIConfig);

module.exports = router;
