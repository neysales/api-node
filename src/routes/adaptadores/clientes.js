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
      `SELECT c.* FROM clientes c
       INNER JOIN clientes_empresas ce ON c.id = ce.cliente_id
       WHERE ce.empresa_id = :empresaId`,
      {
        replacements: { empresaId: req.company.id },
        type: sequelize.QueryTypes.SELECT
      }
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
      `SELECT c.* FROM clientes c
       INNER JOIN clientes_empresas ce ON c.id = ce.cliente_id
       WHERE c.id = :id AND ce.empresa_id = :empresaId`,
      {
        replacements: { 
          id: req.params.id,
          empresaId: req.company.id 
        },
        type: sequelize.QueryTypes.SELECT
      }
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

    const query = `
      INSERT INTO clientes (
        id,
        nome, 
        telefone_celular, 
        email, 
        data_cadastro,
        senha,
        ativo
      ) VALUES (
        uuid_generate_v4(),
        :nome, 
        :telefone, 
        :email, 
        NOW(),
        :senha,
        true
      ) RETURNING *;
    `;

    const [resultado] = await sequelize.query(query, {
      replacements: {
        nome: req.body.nome,
        telefone: req.body.telefone || '',
        email: req.body.email || '',
        senha: req.body.senha || '123456' // senha padrão
      },
      type: sequelize.QueryTypes.INSERT
    });
    
    if (resultado.length === 0) {
      return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
    
    // Inserir relacionamento cliente-empresa
    await sequelize.query(`
      INSERT INTO clientes_empresas (
        cliente_id, 
        empresa_id
      ) VALUES (
        :clienteId, 
        :empresaId
      );
    `, {
      replacements: {
        clienteId: resultado[0].id,
        empresaId: req.company.id
      },
      type: sequelize.QueryTypes.INSERT
    });
    
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
      `SELECT c.* FROM clientes c
       INNER JOIN clientes_empresas ce ON c.id = ce.cliente_id
       WHERE c.id = :id AND ce.empresa_id = :empresaId`,
      {
        replacements: { 
          id: req.params.id,
          empresaId: req.company.id 
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Atualizar cliente
    const [resultado] = await sequelize.query(`
      UPDATE clientes SET
        nome = :nome,
        telefone_celular = :telefone,
        email = :email
      WHERE id = :id
      RETURNING *;
    `, {
      replacements: {
        nome: req.body.nome || clientes[0].nome,
        telefone: req.body.telefone || clientes[0].telefone_celular,
        email: req.body.email || clientes[0].email || '',
        id: req.params.id
      },
      type: sequelize.QueryTypes.UPDATE
    });
    
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
      `SELECT c.* FROM clientes c
       INNER JOIN clientes_empresas ce ON c.id = ce.cliente_id
       WHERE c.id = :id AND ce.empresa_id = :empresaId`,
      {
        replacements: { 
          id: req.params.id,
          empresaId: req.company.id 
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Desativar cliente (exclusão lógica)
    await sequelize.query(`
      UPDATE clientes SET
        data_atualizacao = NOW()
      WHERE id = :id
    `, {
      replacements: {
        id: req.params.id
      },
      type: sequelize.QueryTypes.UPDATE
    });
    
    // Excluir relacionamento cliente-empresa
    await sequelize.query(`
      DELETE FROM clientes_empresas
      WHERE cliente_id = :clienteId AND empresa_id = :empresaId;
    `, {
      replacements: {
        clienteId: req.params.id,
        empresaId: req.company.id
      },
      type: sequelize.QueryTypes.DELETE
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente: ' + error.message });
  }
});

module.exports = router;
