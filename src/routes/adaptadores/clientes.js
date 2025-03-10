const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');
const { apiKeyAuth } = require('../../middleware/auth');

// Todas as rotas requerem autenticação
router.use(apiKeyAuth);

/**
 * Rota para listar todos os clientes da empresa
 */
router.get('/', async (req, res) => {
  try {
    const [clientes] = await sequelize.query(
      `SELECT * FROM clientes WHERE empresa_id = ${req.company.id}`
    );
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes: ' + error.message });
  }
});

/**
 * Rota para obter um cliente pelo ID
 */
router.get('/:id', async (req, res) => {
  try {
    const [clientes] = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${req.params.id} AND empresa_id = ${req.company.id}`
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(clientes[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente: ' + error.message });
  }
});

/**
 * Rota para criar um novo cliente
 */
router.post('/', async (req, res) => {
  try {
    // Validar campos obrigatórios
    if (!req.body.nome || req.body.nome.trim() === '') {
      return res.status(400).json({ error: 'Nome não pode ser vazio' });
    }

    // Inserir cliente
    const query = `
      INSERT INTO clientes (
        nome, 
        telefone_celular, 
        email, 
        empresa_id, 
        "createdAt",
        "updatedAt"
      ) VALUES (
        '${req.body.nome}', 
        '${req.body.telefone || ''}', 
        '${req.body.email || ''}', 
        ${req.company.id}, 
        NOW(),
        NOW()
      ) RETURNING *;
    `;

    const [resultado] = await sequelize.query(query);
    
    if (resultado.length === 0) {
      return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
    
    res.status(201).json(resultado[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente: ' + error.message });
  }
});

/**
 * Rota para atualizar um cliente
 */
router.put('/:id', async (req, res) => {
  try {
    // Verificar se o cliente existe
    const [clientes] = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${req.params.id} AND empresa_id = ${req.company.id}`
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Atualizar cliente
    const [resultado] = await sequelize.query(`
      UPDATE clientes SET
        nome = '${req.body.nome || clientes[0].nome}',
        telefone = '${req.body.telefone || clientes[0].telefone}',
        email = '${req.body.email || clientes[0].email || ''}',
        "updatedAt" = NOW()
      WHERE id = ${req.params.id} AND empresa_id = ${req.company.id}
      RETURNING *;
    `);
    
    res.json(resultado[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente: ' + error.message });
  }
});

/**
 * Rota para excluir um cliente
 */
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se o cliente existe
    const [clientes] = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${req.params.id} AND empresa_id = ${req.company.id}`
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Desativar cliente (exclusão lógica)
    await sequelize.query(`
      UPDATE clientes SET
        "updatedAt" = NOW()
      WHERE id = ${req.params.id} AND empresa_id = ${req.company.id}
    `);
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente: ' + error.message });
  }
});

module.exports = router;
