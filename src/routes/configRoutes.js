const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/configController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /config/api-key:
 *   get:
 *     summary: Retorna a chave API do ambiente
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Chave API retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Chave API do ambiente
 */
router.get('/api-key', (req, res) => {
  const apiKey = process.env.Authentication__ApiKey || '';
  res.json({ apiKey });
});

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Lista todas as configurações
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de configurações
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, ConfigController.getAll);

/**
 * @swagger
 * /config/{id}:
 *   get:
 *     summary: Obtém uma configuração por ID
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuração encontrada
 *       404:
 *         description: Configuração não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', authMiddleware, ConfigController.getById);

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Cria uma nova configuração
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Configuração criada
 *       401:
 *         description: Não autorizado
 */
router.post('/', authMiddleware, ConfigController.create);

/**
 * @swagger
 * /config/{id}:
 *   put:
 *     summary: Atualiza uma configuração
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuração atualizada
 *       404:
 *         description: Configuração não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', authMiddleware, ConfigController.update);

/**
 * @swagger
 * /config/{id}:
 *   delete:
 *     summary: Remove uma configuração
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuração removida
 *       404:
 *         description: Configuração não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', authMiddleware, ConfigController.delete);

module.exports = router;
