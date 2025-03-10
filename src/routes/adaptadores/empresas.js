const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

/**
 * Rota para listar todas as empresas
 */
router.get('/', async (req, res) => {
  try {
    const [empresas] = await sequelize.query(
      `SELECT * FROM empresas WHERE ativa = true`
    );
    res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao listar empresas: ' + error.message });
  }
});

/**
 * Rota para obter uma empresa pelo ID
 */
router.get('/:id', async (req, res) => {
  try {
    const [empresas] = await sequelize.query(
      `SELECT * FROM empresas WHERE id = ${req.params.id} AND ativa = true`
    );
    
    if (empresas.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    res.json(empresas[0]);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa: ' + error.message });
  }
});

/**
 * Rota para criar uma nova empresa
 */
router.post('/', async (req, res) => {
  try {
    // Verificar se já existe alguma empresa
    const [empresas] = await sequelize.query(
      `SELECT COUNT(*) as total FROM empresas WHERE ativa = true`
    );
    
    if (parseInt(empresas[0].total) > 0) {
      return res.status(400).json({ error: 'Já existe uma empresa cadastrada' });
    }
    
    // Validar campos obrigatórios
    if (!req.body.nome || req.body.nome.trim() === '') {
      return res.status(400).json({ error: 'Nome não pode ser vazio' });
    }
    if (!req.body.atividade || req.body.atividade.trim() === '') {
      return res.status(400).json({ error: 'Atividade não pode ser vazia' });
    }
    if (!req.body.responsavel || req.body.responsavel.trim() === '') {
      return res.status(400).json({ error: 'Responsável não pode ser vazio' });
    }
    if (!req.body.telefone_celular || req.body.telefone_celular.trim() === '') {
      return res.status(400).json({ error: 'Celular não pode ser vazio' });
    }
    
    // Gerar API Key
    const apiKey = require('crypto').randomBytes(16).toString('hex').toUpperCase();
    
    // Inserir empresa
    const [resultado] = await sequelize.query(`
      INSERT INTO empresas (
        nome, 
        atividade, 
        responsavel, 
        telefone_celular, 
        chave_api, 
        ativa, 
        ai_provider, 
        ai_api_key, 
        ai_model,
        "createdAt",
        "updatedAt"
      ) VALUES (
        '${req.body.nome}', 
        '${req.body.atividade}', 
        '${req.body.responsavel}', 
        '${req.body.telefone_celular}', 
        '${apiKey}', 
        true, 
        '${req.body.ai_provider || 'openai'}', 
        '${req.body.ai_api_key || ''}', 
        '${req.body.ai_model || 'gpt-3.5-turbo'}',
        NOW(),
        NOW()
      ) RETURNING *;
    `);
    
    res.status(201).json(resultado[0]);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro ao criar empresa: ' + error.message });
  }
});

/**
 * Rota para atualizar uma empresa
 */
router.put('/:id', async (req, res) => {
  try {
    // Verificar se a empresa existe
    const [empresas] = await sequelize.query(
      `SELECT * FROM empresas WHERE id = ${req.params.id} AND ativa = true`
    );
    
    if (empresas.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    // Atualizar empresa
    const [resultado] = await sequelize.query(`
      UPDATE empresas SET
        nome = '${req.body.nome || empresas[0].nome}',
        atividade = '${req.body.atividade || empresas[0].atividade}',
        responsavel = '${req.body.responsavel || empresas[0].responsavel}',
        telefone_celular = '${req.body.telefone_celular || empresas[0].telefone_celular}',
        ai_provider = '${req.body.ai_provider || empresas[0].ai_provider}',
        ai_api_key = '${req.body.ai_api_key || empresas[0].ai_api_key}',
        ai_model = '${req.body.ai_model || empresas[0].ai_model}',
        "updatedAt" = NOW()
      WHERE id = ${req.params.id}
      RETURNING *;
    `);
    
    res.json(resultado[0]);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa: ' + error.message });
  }
});

/**
 * Rota para excluir uma empresa
 */
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se a empresa existe
    const [empresas] = await sequelize.query(
      `SELECT * FROM empresas WHERE id = ${req.params.id} AND ativa = true`
    );
    
    if (empresas.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    // Desativar empresa (exclusão lógica)
    await sequelize.query(`
      UPDATE empresas SET
        ativa = false,
        "updatedAt" = NOW()
      WHERE id = ${req.params.id}
    `);
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ error: 'Erro ao excluir empresa: ' + error.message });
  }
});

module.exports = router;
