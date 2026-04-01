const ProductionLog = require('../models/ProductionLog');

// Get all production logs
exports.getAllProductionLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, equipmentId } = req.query;

    // Build query
    const query = {};

    if (startDate) {
      query.startTime = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query.startTime = { ...(query.startTime || {}), $lte: new Date(endDate) };
    }

    if (equipmentId) {
      query.equipment = equipmentId;
    }

    // Get total count for pagination
    const totalCount = await ProductionLog.countDocuments(query);

    // Get paginated results
    const productionLogs = await ProductionLog.find(query)
      .populate('equipment', 'name type')
      .sort({ startTime: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        productionLogs,
        pagination: {
          totalCount,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all production logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving production logs'
    });
  }
};

// Get production log by ID
exports.getProductionLogById = async (req, res) => {
  try {
    const productionLog = await ProductionLog.findById(req.params.id)
      .populate('equipment', 'name type');

    if (!productionLog) {
      return res.status(404).json({
        success: false,
        message: 'Production log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: productionLog
    });
  } catch (error) {
    console.error('Get production log by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving production log'
    });
  }
};

// Create new production log
exports.createProductionLog = async (req, res) => {
  try {
    const productionData = req.body;

    // Validate equipment exists
    const equipment = await require('../models/Equipment').findById(productionData.equipment);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const productionLog = new ProductionLog(productionData);
    await productionLog.save();

    res.status(201).json({
      success: true,
      message: 'Production log created successfully',
      data: productionLog
    });
  } catch (error) {
    console.error('Create production log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating production log'
    });
  }
};

// Update production log
exports.updateProductionLog = async (req, res) => {
  try {
    const productionLog = await ProductionLog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!productionLog) {
      return res.status(404).json({
        success: false,
        message: 'Production log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Production log updated successfully',
      data: productionLog
    });
  } catch (error) {
    console.error('Update production log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating production log'
    });
  }
};

// Delete production log
exports.deleteProductionLog = async (req, res) => {
  try {
    const productionLog = await ProductionLog.findByIdAndDelete(req.params.id);
    if (!productionLog) {
      return res.status(404).json({
        success: false,
        message: 'Production log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Production log deleted successfully'
    });
  } catch (error) {
    console.error('Delete production log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting production log'
    });
  }
};

module.exports = exports;