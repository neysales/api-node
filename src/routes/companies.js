const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const Company = require('../models/Company');

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - Name
 *         - Activity
 *         - Responsible
 *         - MobileNumber
 *         - IsActive
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *           description: ID único da empresa
 *         Name:
 *           type: string
 *           description: Nome da empresa
 *         Activity:
 *           type: string
 *           description: Atividade principal da empresa
 *         Responsible:
 *           type: string
 *           description: Nome do responsável
 *         Address_Street:
 *           type: string
 *           description: Rua do endereço
 *         Address_City:
 *           type: string
 *           description: Cidade
 *         Address_State:
 *           type: string
 *           description: Estado
 *         Address_PostalCode:
 *           type: string
 *           description: CEP
 *         Address_Country:
 *           type: string
 *           description: País
 *         Address_AdditionalInfo:
 *           type: string
 *           description: Informações adicionais do endereço
 *         Address_Number:
 *           type: string
 *           description: Número do endereço
 *         PhoneNumber:
 *           type: string
 *           description: Telefone fixo
 *         MobileNumber:
 *           type: string
 *           description: Telefone celular
 *         Email:
 *           type: string
 *           format: email
 *           description: Email da empresa
 *         Logo:
 *           type: string
 *           description: URL do logo da empresa
 *         IsActive:
 *           type: boolean
 *           description: Status de atividade da empresa
 *         RegistrationDate:
 *           type: string
 *           format: date-time
 *           description: Data de registro
 *         ApiKey:
 *           type: string
 *           format: uuid
 *           description: Chave de API única da empresa
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Lista todas as empresas
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Busca uma empresa pelo ID
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
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Empresa não encontrada
 */
router.get('/:id', apiKeyAuth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Cria uma nova empresa
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    // Valida campos obrigatórios
    if (!req.body.MobileNumber || req.body.MobileNumber.trim() === '') {
      return res.status(400).json({ error: 'MobileNumber não pode ser vazio' });
    }

    // Converte campos de PascalCase para camelCase
    const companyData = {
      name: req.body.Name,
      activity: req.body.Activity,
      responsible: req.body.Responsible,
      mobileNumber: req.body.MobileNumber.trim(),
      isActive: req.body.IsActive,
      email: req.body.Email,
      addressStreet: req.body.Address_Street,
      addressCity: req.body.Address_City,
      addressState: req.body.Address_State,
      addressPostalCode: req.body.Address_PostalCode,
      addressCountry: req.body.Address_Country,
      addressAdditionalInfo: req.body.Address_AdditionalInfo,
      addressNumber: req.body.Address_Number,
      phoneNumber: req.body.PhoneNumber,
      logo: req.body.Logo,
      registrationDate: new Date(), // Data atual gerada automaticamente
      apiKey: req.body.ApiKey
    };

    const company = await Company.create(companyData);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Atualiza uma empresa
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
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Empresa não encontrada
 */
router.put('/:id', apiKeyAuth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    // Converte campos de PascalCase para camelCase
    const companyData = {
      name: req.body.Name,
      activity: req.body.Activity,
      responsible: req.body.Responsible,
      mobileNumber: req.body.MobileNumber?.trim(),
      isActive: req.body.IsActive,
      email: req.body.Email,
      addressStreet: req.body.Address_Street,
      addressCity: req.body.Address_City,
      addressState: req.body.Address_State,
      addressPostalCode: req.body.Address_PostalCode,
      addressCountry: req.body.Address_Country,
      addressAdditionalInfo: req.body.Address_AdditionalInfo,
      addressNumber: req.body.Address_Number,
      phoneNumber: req.body.PhoneNumber,
      logo: req.body.Logo,
      apiKey: req.body.ApiKey
    };

    await company.update(companyData);
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Remove uma empresa
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
 *         description: Empresa removida com sucesso
 *       404:
 *         description: Empresa não encontrada
 */
router.delete('/:id', apiKeyAuth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    await company.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
