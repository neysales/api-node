const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const agendamentoController = require('../controllers/agendamentoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - customerId
 *         - attendantId
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do agendamento
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: ID do cliente
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         attendantId:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         isServiceDone:
 *           type: boolean
 *           description: Indica se o serviço foi realizado
 *         observations:
 *           type: string
 *           description: Observações sobre o agendamento
 *         status:
 *           type: string
 *           enum: [agendado, confirmado, cancelado, realizado]
 *           description: Status do agendamento
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro do agendamento
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lista todos os agendamentos da empresa
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', apiKeyAuth, agendamentoController.getAllAgendamentos);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtém um agendamento pelo ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', apiKeyAuth, agendamentoController.getAgendamentoById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - attendantId
 *               - date
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               attendantId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *               observations:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [agendado, confirmado, cancelado, realizado]
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos ou horário já agendado
 *       404:
 *         description: Cliente, atendente ou horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', apiKeyAuth, agendamentoController.createAgendamento);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               attendantId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *               isServiceDone:
 *                 type: boolean
 *               observations:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [agendado, confirmado, cancelado, realizado]
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos ou horário já agendado
 *       404:
 *         description: Agendamento, cliente, atendente ou horário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', apiKeyAuth, agendamentoController.updateAgendamento);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       204:
 *         description: Agendamento removido com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', apiKeyAuth, agendamentoController.deleteAgendamento);

module.exports = router;