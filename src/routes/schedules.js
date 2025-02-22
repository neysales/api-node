const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Schedule = require('../models/Schedule');

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - AttendantId
 *         - DayOfWeek
 *         - StartTime
 *         - EndTime
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único do horário
 *         AttendantId:
 *           type: string
 *           format: uuid
 *           description: ID do atendente
 *         DayOfWeek:
 *           type: string
 *           description: Dia da semana
 *         StartTime:
 *           type: string
 *           format: date-time
 *           description: Horário de início
 *         EndTime:
 *           type: string
 *           format: date-time
 *           description: Horário de término
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
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Busca um horário pelo ID
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
 *         description: Horário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Horário não encontrado
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Atualiza um horário
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
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Horário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Horário não encontrado
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    await schedule.update(req.body);
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Remove um horário
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
 *         description: Horário removido com sucesso
 *       404:
 *         description: Horário não encontrado
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Horário não encontrado' });
    }
    await schedule.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;