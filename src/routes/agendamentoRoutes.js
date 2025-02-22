const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const agendamentoController = require('../controllers/agendamentoController');

// Por enquanto, vamos criar rotas básicas que retornam 501 (Not Implemented)
router.use(authMiddleware);

router.get('/', agendamentoController.getAllAgendamentos);
router.get('/:id', agendamentoController.getAgendamentoById);
router.post('/', agendamentoController.createAgendamento);
router.put('/:id', agendamentoController.updateAgendamento);
router.delete('/:id', agendamentoController.deleteAgendamento);

module.exports = router;
