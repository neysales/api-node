const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { Company } = require('../models');
const crypto = require('crypto');

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
 * /api/companies/check:
 *   get:
 *     summary: Verifica se existe alguma empresa cadastrada
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Retorna se existe empresa e a primeira empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 apiKey:
 *                   type: string
 *                   format: uuid
 */
router.get('/check', async (req, res) => {
  try {
    console.log('Verificando empresas ativas...');
    const company = await Company.findOne({
      where: { isActive: true }
    });

    console.log('Resultado da verificação:', company ? 'Empresa encontrada' : 'Nenhuma empresa encontrada');
    
    res.json({
      exists: !!company,
      apiKey: company ? company.apiKey : null
    });
  } catch (error) {
    console.error('Erro ao verificar empresas:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Erro ao verificar empresas: ' + error.message });
  }
});

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Cria uma nova empresa
 *     tags: [Companies]
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
function generateApiKey() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

router.post('/', async (req, res) => {
  try {
    console.log('Recebendo requisição para criar empresa:', req.body);

    // Verifica se já existe alguma empresa
    const existingCompany = await Company.findOne({
      where: { isActive: true }
    });

    if (existingCompany) {
      console.log('Já existe uma empresa ativa');
      return res.status(400).json({ error: 'Já existe uma empresa cadastrada' });
    }

    // Valida campos obrigatórios
    if (!req.body.Name || req.body.Name.trim() === '') {
      return res.status(400).json({ error: 'Nome não pode ser vazio' });
    }
    if (!req.body.Activity || req.body.Activity.trim() === '') {
      return res.status(400).json({ error: 'Atividade não pode ser vazia' });
    }
    if (!req.body.Responsible || req.body.Responsible.trim() === '') {
      return res.status(400).json({ error: 'Responsável não pode ser vazio' });
    }
    if (!req.body.MobileNumber || req.body.MobileNumber.trim() === '') {
      return res.status(400).json({ error: 'Celular não pode ser vazio' });
    }

    // Gera uma API Key única
    const apiKey = generateApiKey();

    // Prepara os dados da empresa
    const companyData = {
      name: req.body.Name,
      activity: req.body.Activity,
      responsible: req.body.Responsible,
      mobileNumber: req.body.MobileNumber.trim(),
      isActive: true,
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
      apiKey: apiKey,
      registrationDate: new Date()
    };

    console.log('Tentando criar empresa com os dados:', companyData);

    const company = await Company.create(companyData);
    console.log('Empresa criada com sucesso:', company.id);
    
    // Retorna a empresa criada junto com a API Key
    const response = company.toJSON();
    response.ApiKey = apiKey; // Adiciona a API Key na resposta em PascalCase

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar empresa:', {
      error: error.message,
      stack: error.stack,
      data: companyData
    });
    res.status(500).json({ error: 'Erro ao criar empresa: ' + error.message });
  }
});

// Todas as rotas abaixo deste ponto requerem autenticação
router.use(apiKeyAuth);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Retorna uma empresa específica
 *     tags: [Companies]
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
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    // Converte os dados para o formato esperado pelo frontend
    const response = {
      Id: company.id,
      Name: company.name,
      Activity: company.activity,
      Responsible: company.responsible,
      MobileNumber: company.mobileNumber,
      PhoneNumber: company.phoneNumber,
      Email: company.email,
      CNPJ: company.cnpj,
      Address_Street: company.addressStreet,
      Address_Number: company.addressNumber,
      Address_AdditionalInfo: company.addressAdditionalInfo,
      Address_City: company.addressCity,
      Address_State: company.addressState,
      Address_Country: company.addressCountry,
      Address_PostalCode: company.addressPostalCode,
      IsActive: company.isActive
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Atualiza uma empresa
 *     tags: [Companies]
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
 *             $ref: '#/components/schemas/Company'
 */
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Atualiza os campos
    await company.update({
      name: req.body.Name,
      activity: req.body.Activity,
      responsible: req.body.Responsible,
      mobileNumber: req.body.MobileNumber,
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
      logo: req.body.Logo
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Remove uma empresa
 *     tags: [Companies]
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
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await company.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover empresa' });
  }
});

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Lista todas as empresas
 *     tags: [Companies]
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
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar empresas' });
  }
});

module.exports = router;
