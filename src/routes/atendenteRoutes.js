const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const atendenteController = require('../controllers/atendenteController');

// Por enquanto, vamos criar rotas básicas que retornam 501 (Not Implemented)
router.use(authMiddleware);

router.get('/', atendenteController.getAllAtendentes);
router.get('/:id', atendenteController.getAtendenteById);
router.post('/', atendenteController.createAtendente);
router.put('/:id', atendenteController.updateAtendente);
router.delete('/:id', atendenteController.deleteAtendente);

module.exports = router;
