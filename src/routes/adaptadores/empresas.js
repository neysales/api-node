const express = require('express');
const router = express.Router();
const { Company } = require('../../models');
const crypto = require('crypto');

/**
 * @swagger
 * /api/adapters/companies:
 *   get:
 *     summary: List all companies
 *     tags: [Legacy Adapters]
 */
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { active: true }
    });
    res.json(companies);
  } catch (error) {
    console.error('Error listing companies:', error);
    res.status(500).json({ error: 'Error listing companies: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/companies/{id}:
 *   get:
 *     summary: Get company by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { 
        id: req.params.id,
        active: true
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Error fetching company: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/companies:
 *   post:
 *     summary: Create new company
 */
router.post('/', async (req, res) => {
  try {
    const companyCount = await Company.count({ where: { active: true }});
    
    if (companyCount > 0) {
      return res.status(400).json({ error: 'A company already exists' });
    }
    
    // Validate required fields
    const requiredFields = {
      name: req.body.nome,
      activity: req.body.atividade,
      responsible: req.body.responsavel,
      phone_mobile: req.body.telefone_celular
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value?.trim()) {
        return res.status(400).json({ error: `${field} cannot be empty` });
      }
    }
    
    const company = await Company.create({
      name: req.body.nome,
      activity: req.body.atividade,
      responsible: req.body.responsavel,
      phone_mobile: req.body.telefone_celular,
      api_key: crypto.randomBytes(16).toString('hex').toUpperCase(),
      active: true,
      registration_date: new Date()
    });
    
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Error creating company: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/companies/{id}:
 *   put:
 *     summary: Update company
 */
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { 
        id: req.params.id,
        active: true
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    await company.update({
      name: req.body.nome || company.name,
      activity: req.body.atividade || company.activity,
      responsible: req.body.responsavel || company.responsible,
      phone_mobile: req.body.telefone_celular || company.phone_mobile
    });
    
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Error updating company: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/companies/{id}:
 *   delete:
 *     summary: Delete company
 */
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { 
        id: req.params.id,
        active: true
      }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    await company.update({ active: false });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Error deleting company: ' + error.message });
  }
});

module.exports = router;