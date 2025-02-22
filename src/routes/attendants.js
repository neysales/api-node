const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Attendant = require('../models/Attendant');

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendant:
 *       type: object
 *       required:
 *         - Name
 *         - SpecialtyId
 *         - MobileNumber
 *         - Email
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único do atendente
 *         Name:
 *           type: string
 *           maxLength: 100
 *           description: Nome do atendente
 *         SpecialtyId:
 *           type: string
 *           format: uuid
 *           description: ID da especialidade
 *         MobileNumber:
 *           type: string
 *           description: Número do celular
 *         Email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Email do atendente
 *         HiringDate:
 *           type: string
 *           format: date-time
 *           description: Data de contratação
 *         IsAdmin:
 *           type: boolean
 *           description: Se o atendente é administrador
 */

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
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const attendants = await Attendant.findAll({
      where: {
        CompanyId: req.company.Id
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
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const attendantData = {
      ...req.body,
      CompanyId: req.company.Id
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
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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