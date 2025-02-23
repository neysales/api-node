const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /config/api-key:
 *   get:
 *     summary: Retorna a chave API do ambiente
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Chave API retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Chave API do ambiente
 */
router.get('/api-key', (req, res) => {
  const apiKey = process.env.Authentication__ApiKey || '';
  res.json({ apiKey });
});

module.exports = router;
