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
 *           description: Unique configuration ID
 *         company_id:
 *           type: string
 *           format: uuid
 *           description: Company ID
 *         logo_url:
 *           type: string
 *           description: Company logo URL
 *         evolution_url:
 *           type: string
 *           description: Evolution API URL
 *         evolution_key:
 *           type: string
 *           description: Evolution API key
 *         evolution_instance:
 *           type: string
 *           description: Evolution API instance
 *         minio_bucket:
 *           type: string
 *           description: MinIO bucket name
 *         minio_port:
 *           type: string
 *           description: MinIO port
 *         minio_access_key:
 *           type: string
 *           description: MinIO access key
 *         minio_secret_key:
 *           type: string
 *           description: MinIO secret key
 *         minio_endpoint:
 *           type: string
 *           description: MinIO endpoint
 *         email:
 *           type: string
 *           description: Notification email address
 *         email_password:
 *           type: string
 *           description: Email password
 *         email_smtp:
 *           type: string
 *           description: SMTP server
 *         email_port:
 *           type: string
 *           description: SMTP server port
 *         email_text_scheduled:
 *           type: string
 *           description: Scheduling email template
 *         email_text_canceled:
 *           type: string
 *           description: Cancellation email template
 *         email_text_confirmed:
 *           type: string
 *           description: Confirmation email template
 *         email_text_rejected:
 *           type: string
 *           description: Rejection email template
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Configuration registration date
 */

/**
 * @swagger
 * /config/api-key:
 *   get:
 *     summary: Get API key from environment
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: API key returned successfully
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
 *     summary: List all configurations
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
router.get('/', apiKeyAuth, ConfigController.getConfig);

/**
 * @swagger
 * /config/{id}:
 *   get:
 *     summary: Get configuration by ID
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
router.get('/:id', apiKeyAuth, ConfigController.getConfig);

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Create new configuration
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
router.post('/', apiKeyAuth, ConfigController.createConfig);

/**
 * @swagger
 * /config/{id}:
 *   put:
 *     summary: Update existing configuration
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
router.put('/:id', apiKeyAuth, ConfigController.updateConfig);

/**
 * @swagger
 * /config/{id}:
 *   delete:
 *     summary: Delete configuration
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
router.delete('/:id', apiKeyAuth, ConfigController.deleteConfig);

module.exports = router;
