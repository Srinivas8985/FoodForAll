const mongoose = require('mongoose');

const DistributionLogSchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodDetails: {
        type: {
            type: String,
            enum: ['cooked', 'raw', 'packed', 'other'],
            default: 'cooked'
        },
        quantity: {
            type: String,
            required: [true, 'Please specify quantity (e.g., 50 meals)']
        },
        description: String
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required for public discovery']
        },
        area: {
            type: String,
            required: [true, 'Area/Locality is required'],
            index: true // Indexed for search
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode'],
            index: true // Indexed for search
        },
        // GeoJSON for future map features (Optional but recommended)
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    distributionDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed', 'cancelled'],
        default: 'active',
        index: true
    },
    contactNumber: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to find upcoming/active distributions in a specific area/pincode quickly
DistributionLogSchema.index({ 'location.pincode': 1, status: 1 });
DistributionLogSchema.index({ 'location.area': 1, status: 1 });

module.exports = mongoose.model('DistributionLog', DistributionLogSchema);
