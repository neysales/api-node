/**
 * Routes to manage AI configuration settings for each company
 */

const express = require('express');
const router = express.Router();
const aiConfigController = require('../controllers/aiConfigController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/ai-config:
 *   get:
 *     summary: Get current company's AI configuration
 *     tags: [AI Configuration]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: AI configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', aiConfigController.getAIConfig);

/**
 * @swagger
 * /api/ai-config:
 *   put:
 *     summary: Update current company's AI configuration
 *     tags: [AI Configuration]
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
 *                 description: AI provider (openai, anthropic, google)
 *                 example: openai
 *               api_key:
 *                 type: string
 *                 description: AI provider's API key
 *                 example: sk-xxxxxxxxxxxxx
 *               model:
 *                 type: string
 *                 description: Specific model to be used
 *                 example: gpt-3.5-turbo
 *               temperature:
 *                 type: number
 *                 description: Temperature for creativity control (0 to 1)
 *                 example: 0.7
 *               prompt:
 *                 type: string
 *                 description: Custom prompt for appointment processing
 *                 example: "You are an assistant specialized in interpreting scheduling requests..."
 *     responses:
 *       200:
 *         description: AI configuration updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/', aiConfigController.updateAIConfig);

module.exports = router;
