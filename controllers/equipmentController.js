const Equipment = require('../models/Equipment');

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get all equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving equipment list'
    });
  }
};

// Get single equipment
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving equipment'
    });
  }
};

// Create new equipment
exports.createEquipment = async (req, res) => {
  try {
    const equipmentData = req.body;

    // Check if serial number already exists
    const existingEquipment = await Equipment.findOne({
      serialNumber: equipmentData.serialNumber
    });

    if (existingEquipment) {
      return res.status(400).json({
        success: false,
        message: 'Equipment with this serial number already exists'
      });
    }

    const equipment = new Equipment(equipmentData);
    await equipment.save();

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: equipment
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating equipment'
    });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating equipment'
    });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting equipment'
    });
  }
};

// Get equipment by status
exports.getEquipmentByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const equipment = await Equipment.find({ status })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving equipment by status'
    });
  }
};

module.exports = exports;