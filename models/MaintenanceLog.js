const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  maintenanceType: {
    type: String,
    enum: ['preventive', 'corrective', 'emergency', 'routine'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  performedBy: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  durationHours: {
    type: Number,
    min: 0
  },
  partsUsed: [{
    partName: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      min: 0
    },
    cost: {
      type: Number,
      min: 0
    }
  }],
  totalCost: {
    type: Number,
    min: 0
  },
  nextMaintenanceDue: {
    type: Date
  },
  mileageOrHours: {
    type: Number, // Either odometer or operating hours
    min: 0
  },
  warrantyClaim: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Indexes
maintenanceLogSchema.index({ equipment: 1, startDate: -1 });
maintenanceLogSchema.index({ nextMaintenanceDue: 1 });
maintenanceLogSchema.index({ status: 1 });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);