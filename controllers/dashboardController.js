const Equipment = require('../models/Equipment');
const ProductionLog = require('../models/ProductionLog');
const MaintenanceLog = require('../models/MaintenanceLog');
const mongoose = require('mongoose');

// Get dashboard overview statistics
exports.getOverview = async (req, res) => {
  try {
    const [totalEquipment, activeEquipment, totalProductionToday, pendingMaintenance] = await Promise.all([
      Equipment.countDocuments(),
      Equipment.countDocuments({ status: 'active' }),
      ProductionLog.countDocuments({
        startTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      MaintenanceLog.countDocuments({ status: 'in-progress' })
    ]);

    // Get recent production data
    const recentProduction = await ProductionLog.find()
      .sort({ startTime: -1 })
      .limit(5)
      .populate('equipment', 'name type');

    // Get equipment status breakdown
    const equipmentStatus = await Equipment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEquipment,
          activeEquipment,
          totalProductionToday,
          pendingMaintenance
        },
        recentProduction,
        equipmentStatus
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard data'
    });
  }
};

// Get equipment performance metrics
exports.getEquipmentPerformance = async (req, res) => {
  try {
    const { equipmentId, days = 7 } = req.query;

    // Parse days parameter
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get equipment details
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Get production logs for the period
    const productionLogs = await ProductionLog.find({
      equipment: equipmentId,
      startTime: { $gte: daysAgo }
    }).sort({ startTime: -1 });

    // Calculate metrics
    const totalBales = productionLogs.reduce((sum, log) => sum + (log.totalBales || 0), 0);
    const totalHours = productionLogs.reduce((sum, log) => {
      const hours = log.endTime ?
        (log.endTime - log.startTime) / (1000 * 60 * 60) :
        (new Date() - log.startTime) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const averageBalesPerHour = totalHours > 0 ? totalBales / totalHours : 0;

    res.status(200).json({
      success: true,
      data: {
        equipment: {
          id: equipment._id,
          name: equipment.name,
          type: equipment.type,
          status: equipment.status
        },
        period: {
          days: parseInt(days),
          from: daysAgo,
          to: new Date()
        },
        metrics: {
          totalBales,
          totalHours: parseFloat(totalHours.toFixed(2)),
          averageBalesPerHour: parseFloat(averageBalesPerHour.toFixed(2)),
          totalProductionLogs: productionLogs.length
        },
        productionLogs
      }
    });
  } catch (error) {
    console.error('Equipment performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving equipment performance'
    });
  }
};

// Get production trends
exports.getProductionTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Aggregate daily production data
    const dailyProduction = await ProductionLog.aggregate([
      {
        $match: {
          startTime: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$startTime' }
          },
          totalBales: { $sum: '$totalBales' },
          averageBalesPerHour: { $avg: '$balesPerHour' },
          totalWeight: { $sum: '$totalWeight' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: dailyProduction
    });
  } catch (error) {
    console.error('Production trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving production trends'
    });
  }
};

// Get maintenance statistics
exports.getMaintenanceStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const maintenanceStats = await MaintenanceLog.aggregate([
      {
        $match: {
          startDate: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            type: '$maintenanceType',
            month: { $dateToString: { format: '%Y-%m', date: '$startDate' } }
          },
          count: { $sum: 1 },
          totalCost: { $sum: '$totalCost' },
          avgDuration: { $avg: '$durationHours' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: maintenanceStats
    });
  } catch (error) {
    console.error('Maintenance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving maintenance statistics'
    });
  }
};

module.exports = exports;