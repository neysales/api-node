const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const clienteController = require('../controllers/clienteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - mobileNumber
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do cliente
 *         name:
 *           type: string
 *           description: Nome do cliente
 *         mobileNumber:
 *           type: string
 *           description: Número de telefone celular do cliente
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do cliente
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         isActive:
 *           type: boolean
 *           description: Indica se o cliente está ativo
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro do cliente
 */

// Todas as rotas requerem autenticação
router.use(apiKeyAuth);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lista todos os clientes da empresa
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', clienteController.getAllClientes);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Obtém um cliente pelo ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Detalhes do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', clienteController.getClienteById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Cria um novo cliente
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
 *               - mobileNumber
 *             properties:
 *               name:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', clienteController.createCliente);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', clienteController.updateCliente);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;