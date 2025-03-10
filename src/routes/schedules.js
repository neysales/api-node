const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const horarioController = require('../controllers/horarioController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - attendantId
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do horário
 *         attendantId:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         dayOfWeek:
 *           type: string
 *           description: Dia da semana
 *         startTime:
 *           type: string
 *           format: time
 *           description: Horário de início
 *         endTime:
 *           type: string
 *           format: time
 *           description: Horário de término
 *         isActive:
 *           type: boolean
 *           description: Indica se o horário está ativo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro do horário
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Lista todos os horários
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de horários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', apiKeyAuth, horarioController.getAllHorarios);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Obtém um horário pelo ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário
 *     responses:
 *       200:
 *         description: Detalhes do horário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', apiKeyAuth, horarioController.getHorarioById);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Cria um novo horário
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendantId
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               attendantId:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', apiKeyAuth, horarioController.createHorario);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Atualiza um horário existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendantId:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Horário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Horário ou atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', apiKeyAuth, horarioController.updateHorario);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Remove um horário
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário
 *     responses:
 *       204:
 *         description: Horário removido com sucesso
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', apiKeyAuth, horarioController.deleteHorario);

module.exports = router;