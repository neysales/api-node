const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const especialidadeController = require('../controllers/especialidadeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialty:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da especialidade
 *         name:
 *           type: string
 *           description: Nome da especialidade
 *         description:
 *           type: string
 *           description: Descrição da especialidade
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: ID da empresa
 *         isActive:
 *           type: boolean
 *           description: Indica se a especialidade está ativa
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de cadastro da especialidade
 */

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     tags:
 *       - Specialties
 *     summary: Lista todas as especialidades da empresa autenticada
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
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', apiKeyAuth, especialidadeController.getAllEspecialidades);

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     tags:
 *       - Specialties
 *     summary: Obtém uma especialidade específica pelo ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da especialidade
 *     responses:
 *       200:
 *         description: Detalhes da especialidade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Especialidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', apiKeyAuth, especialidadeController.getEspecialidadeById);

/**
 * @swagger
 * /api/specialties:
 *   post:
 *     tags:
 *       - Specialties
 *     summary: Cria uma nova especialidade
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
 *                 description: Nome da especialidade
 *               description:
 *                 type: string
 *                 description: Descrição da especialidade
 *               isActive:
 *                 type: boolean
 *                 description: Indica se a especialidade está ativa
 *     responses:
 *       201:
 *         description: Especialidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', apiKeyAuth, especialidadeController.createEspecialidade);

/**
 * @swagger
 * /api/specialties/{id}:
 *   put:
 *     tags:
 *       - Specialties
 *     summary: Atualiza uma especialidade existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da especialidade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da especialidade
 *               description:
 *                 type: string
 *                 description: Descrição da especialidade
 *               isActive:
 *                 type: boolean
 *                 description: Indica se a especialidade está ativa
 *     responses:
 *       200:
 *         description: Especialidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Especialidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', apiKeyAuth, especialidadeController.updateEspecialidade);

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     tags:
 *       - Specialties
 *     summary: Remove uma especialidade
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da especialidade
 *     responses:
 *       204:
 *         description: Especialidade removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Especialidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', apiKeyAuth, especialidadeController.deleteEspecialidade);

module.exports = router;