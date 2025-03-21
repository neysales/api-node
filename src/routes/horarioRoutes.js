const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of schedules retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', horarioController.getAllHorarios);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule UUID
 */
router.get('/:id', horarioController.getHorarioById);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create new schedule
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendant_id
 *               - day_of_week
 *               - start_time
 *               - end_time
 */
router.post('/', horarioController.createHorario);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update schedule
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 */
router.put('/:id', horarioController.updateHorario);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete schedule
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 */
router.delete('/:id', horarioController.deleteHorario);

module.exports = router;