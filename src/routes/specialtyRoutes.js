const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/especialidadeController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     summary: Get all specialties
 *     tags: [Specialties]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of specialties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', specialtyController.getAllEspecialidades);

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     summary: Get specialty by ID
 *     tags: [Specialties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Specialty UUID
 */
router.get('/:id', specialtyController.getEspecialidadeById);

/**
 * @swagger
 * /api/specialties:
 *   post:
 *     summary: Create new specialty
 *     tags: [Specialties]
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
 *               - description
 */
router.post('/', specialtyController.createEspecialidade);

/**
 * @swagger
 * /api/specialties/{id}:
 *   put:
 *     summary: Update specialty
 *     tags: [Specialties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/:id', specialtyController.updateEspecialidade);

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     summary: Delete specialty
 *     tags: [Specialties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', specialtyController.deleteEspecialidade);

module.exports = router;