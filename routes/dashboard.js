const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/overview', protect, dashboardController.getOverview);
router.get('/performance', protect, dashboardController.getEquipmentPerformance);
router.get('/trends', protect, dashboardController.getProductionTrends);
router.get('/maintenance', protect, dashboardController.getMaintenanceStats);

module.exports = router;