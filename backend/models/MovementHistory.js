const mongoose = require('mongoose');

const movementHistorySchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    equipment_type: {
        type: String
    },
    previous_location: {
        type: String,
        required: true
    },
    new_location: {
        type: String,
        required: true
    },
    signal_strength: {
        type: Number,
        default: -50
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for efficient queries
movementHistorySchema.index({ device_id: 1 });
movementHistorySchema.index({ timestamp: -1 });

module.exports = mongoose.model('MovementHistory', movementHistorySchema);
