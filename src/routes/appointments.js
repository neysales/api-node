const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Appointment = require('../models/Appointment');

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - CustomerId
 *         - CompanyId
 *         - AttendantId
 *         - AppointmentDate
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único do agendamento
 *         CustomerId:
 *           type: string
 *           format: uuid
 *           description: ID do cliente
 *         CompanyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         AttendantId:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         AppointmentDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         IsServiceDone:
 *           type: boolean
 *           description: Indica se o serviço foi realizado
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lista todos os agendamentos
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
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       204:
 *         description: Agendamento removido com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;