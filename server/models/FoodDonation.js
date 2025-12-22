const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodName: {
        type: String,
        required: [true, 'Please add food name']
    },
    quantity: {
        type: String,
        required: [true, 'Please add quantity']
    },
    foodType: {
        type: String,
        enum: ['cooked', 'packaged', 'raw'],
        required: [true, 'Please add food type']
    },
    preparationTime: {
        type: String, // Can be a time string or description
        required: function () { return this.foodType === 'cooked'; }
    },
    isVegetarian: {
        type: Boolean, // User can specify if it is veg or non-veg
        default: true
    },
    servings: {
        type: Number,
        required: [true, 'Please add number of servings']
    },
    expiryTime: {
        type: Date,
        required: [true, 'Please add expiry time']
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please add pickup location']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    contactPhone: {
        type: String,
        required: [true, 'Please add contact phone']
    },
    message: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['available', 'assigned', 'delivered', 'expired'],
        default: 'available'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipientType: {
        type: String,
        enum: ['ngo', 'portal'],
        default: 'portal'
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // NGO ID if type is 'ngo'
    },
    donationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'assigned', 'distributed', 'rejected'],
        default: 'pending'
    },
    donorNotes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
