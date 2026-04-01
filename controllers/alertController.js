const Alert = require('../models/alert');
const User = require('../models/User');
const Equipment = require('../models/Equipment');

// Get all alerts
exports.getAlerts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      severity,
      isRead,
      isAcknowledged,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};

    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (isAcknowledged !== undefined) query.isAcknowledged = isAcknowledged === 'true';

    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.createdAt = { ...(query.createdAt || {}), $lte: new Date(endDate) };
    }

    // Get total count for pagination
    const totalCount = await Alert.countDocuments(query);

    // Get paginated results
    const alerts = await Alert.find(query)
      .populate('equipment', 'name type')
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        alerts,
        pagination: {
          totalCount,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving alerts'
    });
  }
};

// Create new alert
exports.createAlert = async (req, res) => {
  try {
    const alertData = req.body;

    // Validate required fields
    if (!alertData.type || !alertData.title || !alertData.message) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and message are required'
      });
    }

    const alert = new Alert(alertData);
    await alert.save();

    // Emit real-time alert via socket.io if available
    // This would be handled in the socket.io connection

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating alert'
    });
  }
};

// Mark alert as read
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert marked as read',
      data: alert
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking alert as read'
    });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        isAcknowledged: true,
        acknowledgedBy: req.user.id,
        acknowledgedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error acknowledging alert'
    });
  }
};

// Delete alert
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting alert'
    });
  }
};

// Get unread alert count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({ isRead: false });
    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving unread count'
    });
  }
};

module.exports = exports;