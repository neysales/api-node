const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clienteController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', clientController.getAllClientes);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client UUID
 */
router.get('/:id', clientController.getClienteById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create new client
 *     tags: [Clients]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_mobile
 */
router.post('/', clientController.createCliente);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/:id', clientController.updateCliente);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', clientController.deleteCliente);

module.exports = router;