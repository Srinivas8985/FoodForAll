const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemsNeeded: {
        type: String,
        required: [true, 'Please specify items needed']
    },
    quantityNeeded: {
        type: String,
        required: [true, 'Please specify quantity needed']
    },
    location: {
        type: String,
        required: [true, 'Please add location']
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    message: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['active', 'fulfilled', 'cancelled'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FoodRequest', foodRequestSchema);
