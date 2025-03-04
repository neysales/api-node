const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { Customer } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - mobileNumber
 *         - companyId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         companyId:
 *           type: string
 *           format: uuid
 *         isActive:
 *           type: boolean
 */

// Todas as rotas requerem autenticação
router.use(apiKeyAuth);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lista todos os clientes da empresa
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: {
        companyId: req.company.id
      }
    });
    res.json(customers);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Obtém um cliente pelo ID
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
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Cria um novo cliente
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      companyId: req.company.id
    };
    const customer = await Customer.create(customerData);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualiza um cliente
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
 *             $ref: '#/components/schemas/Customer'
 */
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const updatedCustomer = await customer.update(req.body);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Remove um cliente
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
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        companyId: req.company.id
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await customer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;