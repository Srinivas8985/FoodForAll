const mongoose = require('mongoose');

const foodAvailabilitySchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true,
        index: true
    },
    foodType: {
        type: String,
        enum: ['cooked', 'packaged', 'raw'],
        required: true
    },
    quantity: {
        type: String, // e.g., "50 meals"
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeWindow: {
        from: String,
        to: String
    },
    contactPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'finished', 'expired'],
        default: 'available'
    },
    relatedDonationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodDonation'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for expiring or searching by date/time
foodAvailabilitySchema.index({ pincode: 1, status: 1 });

module.exports = mongoose.model('FoodAvailability', foodAvailabilitySchema);
