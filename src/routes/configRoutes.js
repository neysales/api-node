const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');

/**
 * @swagger
 * /config/api-key:
 *   get:
 *     summary: Get the API key from environment
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: API key returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Environment API key
 */
router.get('/api-key', (req, res) => {
  const apiKey = process.env.Authentication__ApiKey || '';
  res.json({ apiKey });
});

/**
 * @swagger
 * /config/company:
 *   get:
 *     summary: Get company configuration
 *     tags: [Config]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Company configuration
 *       401:
 *         description: Unauthorized
 */
router.get('/company', apiKeyAuth, async (req, res) => {
  try {
    res.json({
      company: {
        id: req.company.id,
        name: req.company.name,
        isActive: req.company.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
