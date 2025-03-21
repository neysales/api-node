const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');
const aiAgendamentoController = require('../controllers/aiAgendamentoController');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

// AI Appointment processing routes
router.post('/process', aiAgendamentoController.processarSolicitacao);
router.post('/suggest', aiAgendamentoController.sugerirAgendamento);
router.post('/validate', aiAgendamentoController.validarSolicitacao);

module.exports = router;