const express = require('express');
const router = express.Router();
const companyController = require('../controllers/empresaController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/companies/check:
 *   get:
 *     summary: Check company existence
 *     tags: [Companies]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Company check successful
 */
router.get('/check', companyController.checkEmpresa);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - activity
 *               - responsible
 *               - phone_mobile
 *               - email
 */
router.post('/', companyController.createEmpresa);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/:id', companyController.getEmpresaById);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company
 *     tags: [Companies]
 *     security:
 *       - ApiKeyAuth: []
 */
router.put('/:id', companyController.updateEmpresa);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company
 *     tags: [Companies]
 *     security:
 *       - ApiKeyAuth: []
 */
router.delete('/:id', companyController.deleteEmpresa);

/**
 * @swagger
 * /api/companies/{id}/api-key:
 *   post:
 *     summary: Regenerate company API key
 *     tags: [Companies]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/:id/api-key', companyController.regenerateApiKey);

module.exports = router;