const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const { protect } = require('../middleware/auth');

// Routes
router.get('/', protect, productionController.getAllProductionLogs);
router.get('/:id', protect, productionController.getProductionLogById);
router.post('/', protect, productionController.createProductionLog);
router.put('/:id', protect, productionController.updateProductionLog);
router.delete('/:id', protect, productionController.deleteProductionLog);

module.exports = router;