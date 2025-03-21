const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/atendenteController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

/**
 * @swagger
 * /api/attendants:
 *   get:
 *     summary: Get all attendants
 *     tags: [Attendants]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/', attendantController.getAllAtendentes);

/**
 * @swagger
 * /api/attendants/{id}:
 *   get:
 *     summary: Get attendant by ID
 *     tags: [Attendants]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/:id', attendantController.getAtendenteById);

/**
 * @swagger
 * /api/attendants:
 *   post:
 *     summary: Create new attendant
 *     tags: [Attendants]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/', attendantController.createAtendente);

/**
 * @swagger
 * /api/attendants/{id}:
 *   put:
 *     summary: Update attendant
 *     tags: [Attendants]
 *     security:
 *       - ApiKeyAuth: []
 */
router.put('/:id', attendantController.updateAtendente);

/**
 * @swagger
 * /api/attendants/{id}:
 *   delete:
 *     summary: Delete attendant
 *     tags: [Attendants]
 *     security:
 *       - ApiKeyAuth: []
 */
router.delete('/:id', attendantController.deleteAtendente);

module.exports = router;