const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const horarioController = require('../controllers/horarioController');

// Por enquanto, vamos criar rotas básicas que retornam 501 (Not Implemented)
router.use(authMiddleware);

router.get('/', horarioController.getAllHorarios);
router.get('/:id', horarioController.getHorarioById);
router.post('/', horarioController.createHorario);
router.put('/:id', horarioController.updateHorario);
router.delete('/:id', horarioController.deleteHorario);

module.exports = router;
