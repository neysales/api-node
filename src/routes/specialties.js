const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Specialty = require('../models/Specialty');

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialty:
 *       type: object
 *       required:
 *         - Name
 *         - Description
 *         - CompanyId
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único da especialidade
 *         Name:
 *           type: string
 *           description: Nome da especialidade
 *         Description:
 *           type: string
 *           description: Descrição da especialidade
 *         CompanyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 */

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     summary: Lista todas as especialidades
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Specialty'
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     summary: Busca uma especialidade pelo ID
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
 *         description: Especialidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       404:
 *         description: Especialidade não encontrada
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }
    res.json(specialty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties:
 *   post:
 *     summary: Cria uma nova especialidade
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Specialty'
 *     responses:
 *       201:
 *         description: Especialidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   put:
 *     summary: Atualiza uma especialidade
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
 *             $ref: '#/components/schemas/Specialty'
 *     responses:
 *       200:
 *         description: Especialidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       404:
 *         description: Especialidade não encontrada
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }
    await specialty.update(req.body);
    res.json(specialty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     summary: Remove uma especialidade
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
 *         description: Especialidade removida com sucesso
 *       404:
 *         description: Especialidade não encontrada
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }
    await specialty.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;