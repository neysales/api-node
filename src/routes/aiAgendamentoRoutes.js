const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const aiAgendamentoController = require('../controllers/aiAgendamentoController');

router.use(apiKeyAuth);

// Endpoint para processar solicitações de agendamento via IA
router.post('/processar', aiAgendamentoController.processarSolicitacao.bind(aiAgendamentoController));

module.exports = router;
