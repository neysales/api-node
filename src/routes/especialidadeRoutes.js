const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const especialidadeController = require('../controllers/especialidadeController');

// Por enquanto, vamos criar rotas básicas que retornam 501 (Not Implemented)
router.use(authMiddleware);

router.get('/', especialidadeController.getAllEspecialidades);
router.get('/:id', especialidadeController.getEspecialidadeById);
router.post('/', especialidadeController.createEspecialidade);
router.put('/:id', especialidadeController.updateEspecialidade);
router.delete('/:id', especialidadeController.deleteEspecialidade);

module.exports = router;
