const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const ConfigController = require('../controllers/configController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Config:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da configuração
 *         empresa_id:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         logo_url:
 *           type: string
 *           description: URL do logo da empresa
 *         evolution_url:
 *           type: string
 *           description: URL da API Evolution
 *         evolution_key:
 *           type: string
 *           description: Chave da API Evolution
 *         evolution_instancia:
 *           type: string
 *           description: Instância da API Evolution
 *         minio_bucket:
 *           type: string
 *           description: Bucket do MinIO
 *         minio_port:
 *           type: string
 *           description: Porta do MinIO
 *         minio_access_key:
 *           type: string
 *           description: Chave de acesso do MinIO
 *         minio_secret_key:
 *           type: string
 *           description: Chave secreta do MinIO
 *         minio_endpoint:
 *           type: string
 *           description: Endpoint do MinIO
 *         email:
 *           type: string
 *           description: E-mail para envio de notificações
 *         email_senha:
 *           type: string
 *           description: Senha do e-mail
 *         email_smtp:
 *           type: string
 *           description: Servidor SMTP
 *         email_porta:
 *           type: string
 *           description: Porta do servidor SMTP
 *         email_texto_agendado:
 *           type: string
 *           description: Texto para e-mail de agendamento
 *         email_texto_cancelado:
 *           type: string
 *           description: Texto para e-mail de cancelamento
 *         email_texto_confirmado:
 *           type: string
 *           description: Texto para e-mail de confirmação
 *         email_texto_recusado:
 *           type: string
 *           description: Texto para e-mail de recusa
 *         data_cadastro:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro da configuração
 */

/**
 * @swagger
 * /config/api-key:
 *   get:
 *     summary: Get the API key from environment
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: API key returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Environment API key
 */
router.get('/api-key', (req, res) => {
  const apiKey = process.env.Authentication__ApiKey || '';
  res.json({ apiKey });
});

/**
 * @swagger
 * /config/company:
 *   get:
 *     summary: Get company configuration
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Company configuration
 *       401:
 *         description: Unauthorized
 */
router.get('/company', apiKeyAuth, async (req, res) => {
  try {
    res.json({
      company: {
        id: req.company.id,
        name: req.company.name,
        isActive: req.company.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Config'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', apiKeyAuth, ConfigController.getAll);

/**
 * @swagger
 * /config/{id}:
 *   get:
 *     summary: Obtém uma configuração pelo ID
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da configuração
 *     responses:
 *       200:
 *         description: Detalhes da configuração
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       404:
 *         description: Configuração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', apiKeyAuth, ConfigController.getById);

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
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       201:
 *         description: Configuração criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', apiKeyAuth, ConfigController.create);

/**
 * @swagger
 * /config/{id}:
 *   put:
 *     summary: Atualiza uma configuração existente
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da configuração
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       200:
 *         description: Configuração atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       404:
 *         description: Configuração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', apiKeyAuth, ConfigController.update);

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
 *         description: ID da configuração
 *     responses:
 *       200:
 *         description: Configuração removida com sucesso
 *       404:
 *         description: Configuração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', apiKeyAuth, ConfigController.delete);

module.exports = router;
