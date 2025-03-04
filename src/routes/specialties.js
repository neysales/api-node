const express = require('express');
const router = express.Router();
const { Specialty } = require('../models');
const { apiKeyAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     tags:
 *       - Specialties
 *     summary: List all specialties for the authenticated company
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of specialties
 *       401:
 *         description: Unauthorized
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      where: {
        companyId: req.company.id,
        isActive: true
      }
    });
    res.json(specialties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     tags:
 *       - Specialties
 *     summary: Get a specific specialty by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Specialty ID
 *     responses:
 *       200:
 *         description: Specialty details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id,
        isActive: true
      }
    });
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    res.json(specialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/specialties:
 *   post:
 *     tags:
 *       - Specialties
 *     summary: Create a new specialty
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Specialty created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.create({
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      companyId: req.company.id
    });
    
    res.status(201).json(specialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   put:
 *     tags:
 *       - Specialties
 *     summary: Update a specialty
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Specialty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Specialty updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id,
        isActive: true
      }
    });
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    await specialty.update({
      name: req.body.name || specialty.name,
      description: req.body.description || specialty.description
    });
    
    res.json(specialty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     tags:
 *       - Specialties
 *     summary: Delete a specialty (soft delete)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Specialty ID
 *     responses:
 *       200:
 *         description: Specialty deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const specialty = await Specialty.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id,
        isActive: true
      }
    });
    
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }
    
    await specialty.update({ isActive: false });
    
    res.json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;