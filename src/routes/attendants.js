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
 *         - CompanyId
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
 *         CompanyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
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
 *           description: Indica se o atendente é administrador
 */

/**
 * @swagger
 * /api/attendants:
 *   get:
 *     summary: Lista todos os atendentes
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
    const attendants = await Attendant.findAll();
    res.json(attendants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/attendants/mobile/{mobileNumber}:
 *   get:
 *     summary: Busca atendente por número de celular
 *     parameters:
 *       - in: path
 *         name: mobileNumber
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Atendente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 *       404:
 *         description: Atendente não encontrado
 */
router.get('/mobile/:mobileNumber', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findOne({
      where: { MobileNumber: req.params.mobileNumber }
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.create(req.body);
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
 *             $ref: '#/components/schemas/Attendant'
 *     responses:
 *       200:
 *         description: Atendente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendant'
 *       404:
 *         description: Atendente não encontrado
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findByPk(req.params.id);
    if (!attendant) {
      return res.status(404).json({ error: 'Atendente não encontrado' });
    }
    await attendant.update(req.body);
    res.json(attendant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/attendants/{id}:
 *   delete:
 *     summary: Remove um atendente
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
 *         description: Atendente removido com sucesso
 *       404:
 *         description: Atendente não encontrado
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const attendant = await Attendant.findByPk(req.params.id);
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