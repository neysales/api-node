const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Customer = require('../models/Customer');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - Name
 *         - MobileNumber
 *         - Password
 *         - CompanyId
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único do cliente
 *         Name:
 *           type: string
 *           maxLength: 100
 *           description: Nome do cliente
 *         MobileNumber:
 *           type: string
 *           description: Número do celular
 *         Email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Email do cliente
 *         RegistrationDate:
 *           type: string
 *           format: date-time
 *           description: Data de registro
 *         Password:
 *           type: string
 *           description: Senha do cliente
 *         CompanyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa à qual o cliente pertence
 */

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
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: {
        CompanyId: req.company.Id
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
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      CompanyId: req.company.Id
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
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        Id: req.params.id,
        CompanyId: req.company.Id
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