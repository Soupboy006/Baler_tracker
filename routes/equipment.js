const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { protect } = require('../middleware/auth');

// Routes
router.get('/', protect, equipmentController.getAllEquipment);
router.get('/:id', protect, equipmentController.getEquipmentById);
router.post('/', protect, equipmentController.createEquipment);
router.put('/:id', protect, equipmentController.updateEquipment);
router.delete('/:id', protect, equipmentController.deleteEquipment);
router.get('/status/:status', protect, equipmentController.getEquipmentByStatus);

module.exports = router;