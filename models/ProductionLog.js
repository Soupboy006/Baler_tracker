const mongoose = require('mongoose');

const productionLogSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  shift: {
    type: String,
    enum: ['day', 'night', 'overlap'],
    required: true
  },
  operator: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  totalBales: {
    type: Number,
    min: 0,
    default: 0
  },
  balesPerHour: {
    type: Number,
    min: 0,
    default: 0
  },
  totalWeight: {
    type: Number, // kg or lbs
    min: 0,
    default: 0
  },
  averageWeight: {
    type: Number,
    min: 0,
    default: 0
  },
  totalBaleLength: {
    type: Number, // meters or feet
    min: 0,
    default: 0
  },
  averageBaleLength: {
    type: Number,
    min: 0,
    default: 0
  },
  qualityMetrics: {
    density: {
      type: Number, // kg/m3 or lbs/ft3
      min: 0
    },
    moistureContent: {
      type: Number, // percentage
      min: 0,
      max: 100
    },
    compressionRatio: {
      type: Number
    }
  },
  operationalStatus: {
    type: String,
    enum: ['running', 'stopped', 'maintenance', 'error', 'idle'],
    default: 'idle'
  },
  downtimeMinutes: {
    type: Number,
    min: 0,
    default: 0
  },
  energyConsumption: {
    type: Number, // kWh
    min: 0
  },
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for performance
productionLogSchema.index({ equipment: 1, startTime: -1 });
productionLogSchema.index({ startTime: -1 });
productionLogSchema.index({ operationalStatus: 1 });

module.exports = mongoose.model('ProductionLog', productionLogSchema);