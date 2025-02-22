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
 */

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     summary: Lista todas as especialidades da empresa
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
    const specialties = await Specialty.findAll({
      where: {
        CompanyId: req.company.Id
      }
    });
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     summary: Obtém uma especialidade pelo ID
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
 *         description: Especialidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
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
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const specialtyData = {
      ...req.body,
      CompanyId: req.company.Id
    };
    const specialty = await Specialty.create(specialtyData);
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
 *             $ref: '#/components/schemas/Specialty'
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
    
    if (!specialty) {
      return res.status(404).json({ error: 'Especialidade não encontrada' });
    }

    const updatedSpecialty = await specialty.update(req.body);
    res.json(updatedSpecialty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     summary: Remove uma especialidade
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
    const specialty = await Specialty.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
      }
    });
    
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