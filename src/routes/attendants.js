const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { Attendant } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendant:
 *       type: object
 *       required:
 *         - name
 *         - specialtyId
 *         - mobileNumber
 *         - email
 *         - hiringDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         specialtyId:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *         mobileNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         hiringDate:
 *           type: string
 *           format: date-time
 *         isAdmin:
 *           type: boolean
 *         isActive:
 *           type: boolean
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
 */
router.get('/', async (req, res) => {
  try {
    const attendants = await Attendant.findAll({
      where: {
        companyId: req.company.id
      }
    });
    res.json(attendants);
  } catch (error) {
    console.error('Erro ao listar atendentes:', error);
    res.status(500).json({ error: 'Erro ao listar atendentes' });
  }
});

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
 *     responses:
 *       200:
 *         description: Atendente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 */
router.get('/:id', async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    if (!attendant) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }
    res.json(attendant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
 *             $ref: '#/components/schemas/Attendant'
 *     responses:
 *       201:
 *         description: Atendente criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const attendantData = {
      ...req.body,
      companyId: req.company.id
    };
    const attendant = await Attendant.create(attendantData);
    res.status(201).json(attendant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/attendants/{id}:
 *   put:
 *     summary: Atualiza um atendente
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
 *             $ref: '#/components/schemas/Attendant'
 */
router.put('/:id', async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    
    if (!attendant) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    const updatedAttendant = await attendant.update(req.body);
    res.json(updatedAttendant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
 */
router.delete('/:id', async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    
    if (!attendant) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }

    await attendant.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;