const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const atendenteController = require('../controllers/atendenteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendant:
 *       type: object
 *       required:
 *         - name
 *         - specialtyId
 *         - phone
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do atendente
 *         name:
 *           type: string
 *           description: Nome do atendente
 *         specialtyId:
 *           type: string
 *           format: uuid
 *           description: ID da especialidade do atendente
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         phone:
 *           type: string
 *           description: Número de telefone celular do atendente
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do atendente
 *         isActive:
 *           type: boolean
 *           description: Indica se o atendente está ativo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro do atendente
 */

// Todas as rotas requerem autenticação
router.use(apiKeyAuth);

/**
 * @swagger
 * /api/attendants:
 *   get:
 *     summary: Lista todos os atendentes da empresa
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de atendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendant'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', atendenteController.getAllAtendentes);

/**
 * @swagger
 * /api/attendants/{id}:
 *   get:
 *     summary: Obtém um atendente pelo ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do atendente
 *     responses:
 *       200:
 *         description: Detalhes do atendente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', atendenteController.getAtendenteById);

/**
 * @swagger
 * /api/attendants:
 *   post:
 *     summary: Cria um novo atendente
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
 *               - specialtyId
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               specialtyId:
 *                 type: string
 *                 format: uuid
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Atendente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Especialidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', atendenteController.createAtendente);

/**
 * @swagger
 * /api/attendants/{id}:
 *   put:
 *     summary: Atualiza um atendente existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do atendente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialtyId:
 *                 type: string
 *                 format: uuid
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Atendente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Atendente ou especialidade não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', atendenteController.updateAtendente);

/**
 * @swagger
 * /api/attendants/{id}:
 *   delete:
 *     summary: Remove um atendente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do atendente
 *     responses:
 *       204:
 *         description: Atendente removido com sucesso
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', atendenteController.deleteAtendente);

module.exports = router;