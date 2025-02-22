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
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        CompanyId: req.company.Id
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
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
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      CompanyId: req.company.Id
    };
    const appointment = await Appointment.create(appointmentData);
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
 *             $ref: '#/components/schemas/Appointment'
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const updatedAppointment = await appointment.update(req.body);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
    
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