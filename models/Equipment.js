const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['agricultural', 'recycling', 'industrial', 'other']
  },
  model: {
    type: String,
    trim: true,
    maxlength: 100
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true,
    maxlength: 100
  },
  purchaseDate: {
    type: Date
  },
  installationDate: {
    type: Date
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'offline'],
    default: 'active'
  },
  currentJob: {
    type: String,
    trim: true,
    maxlength: 100
  },
  operatingHours: {
    type: Number,
    default: 0
  },
  lastMaintenance: {
    type: Date
  },
  nextMaintenance: {
    type: Date
  },
  maintenanceInterval: {
    type: Number, // in hours
    default: 100
  },
  specifications: {
    maxCapacity: {
      type: Number, // tons/hour
      min: 0
    },
    powerRating: {
      type: Number, // kW
      min: 0
    },
    weight: {
      type: Number, // kg
      min: 0
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    }
  },
  metadata: {
    tags: [String],
    notes: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
equipmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Equipment', equipmentSchema);