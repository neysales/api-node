const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/agendamentoController');
const { apiKeyAuth } = require('../middleware/auth');
const { isolamentoDados } = require('../middleware/isolamento');

// Apply middlewares
router.use(apiKeyAuth);
router.use(isolamentoDados);

// Appointment routes
router.get('/', appointmentController.getAllAgendamentos);
router.get('/:id', appointmentController.getAgendamentoById);
router.post('/', appointmentController.createAgendamento);
router.put('/:id', appointmentController.updateAgendamento);
router.delete('/:id', appointmentController.deleteAgendamento);

// Additional status update routes
router.put('/:id/perform', appointmentController.performService);
router.put('/:id/cancel', appointmentController.cancelAppointment);
router.put('/:id/confirm', appointmentController.confirmAppointment);
router.put('/:id/reject', appointmentController.rejectAppointment);

module.exports = router;