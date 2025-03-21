const express = require('express');
const router = express.Router();
const { Client, Company } = require('../../models');
const { apiKeyAuth } = require('../../middleware/auth');
const { dataIsolation } = require('../../middleware/isolation');

// Apply middlewares
router.use(apiKeyAuth);
router.use(dataIsolation);

/**
 * @swagger
 * /api/adapters/clients:
 *   get:
 *     summary: List all clients for company
 *     tags: [Legacy Adapters]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{
        model: Company,
        where: { id: req.company.id },
        attributes: []
      }]
    });
    res.json(clients);
  } catch (error) {
    console.error('Error listing clients:', error);
    res.status(500).json({ error: 'Error listing clients: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/clients/{id}:
 *   get:
 *     summary: Get client by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id: req.params.id },
      include: [{
        model: Company,
        where: { id: req.company.id },
        attributes: []
      }]
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Error fetching client: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/clients:
 *   post:
 *     summary: Create new client
 */
router.post('/', async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const client = await Client.create({
      name: req.body.name,
      phone_mobile: req.body.phone || '',
      email: req.body.email || '',
      password: req.body.password || '123456',
      active: true
    });

    await client.addCompany(req.company.id);
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Error creating client: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/clients/{id}:
 *   put:
 *     summary: Update client
 */
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id: req.params.id },
      include: [{
        model: Company,
        where: { id: req.company.id }
      }]
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    await client.update({
      name: req.body.name || client.name,
      phone_mobile: req.body.phone || client.phone_mobile,
      email: req.body.email || client.email
    });
    
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Error updating client: ' + error.message });
  }
});

/**
 * @swagger
 * /api/adapters/clients/{id}:
 *   delete:
 *     summary: Delete client
 */
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id: req.params.id },
      include: [{
        model: Company,
        where: { id: req.company.id }
      }]
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    await client.removeCompany(req.company.id);
    await client.update({ active: false });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Error deleting client: ' + error.message });
  }
});

module.exports = router;