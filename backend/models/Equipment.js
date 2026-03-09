const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    equipment_type: {
        type: String,
        required: true,
        enum: ['Wheelchair', 'Stretcher', 'Oxygen Cylinder', 'IV Stand', 'Defibrillator', 'Monitor']
    },
    location: {
        type: String,
        required: true,
        enum: ['Emergency Room', 'ICU', 'Ward A', 'Ward B', 'Corridor', 'Radiology']
    },
    status: {
        type: String,
        enum: ['Available', 'In Use', 'Maintenance', 'Charging'],
        default: 'Available'
    },
    battery_level: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    signal_strength: {
        type: Number,
        default: -50 // RSSI value in dBm
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for quick lookups
equipmentSchema.index({ device_id: 1 });
equipmentSchema.index({ location: 1 });
equipmentSchema.index({ status: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
