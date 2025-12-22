const mongoose = require('mongoose');

const moneyDonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    currency: {
        type: String,
        default: 'INR'
    },
    donationType: {
        type: String,
        enum: ['ngo', 'emergency_fund'],
        required: true
    },
    recipientNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Required only if donationType is 'ngo'
        required: function () { return this.donationType === 'ngo'; }
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'dummy'],
        default: 'dummy'
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'success'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    usageProofImages: {
        type: [String],
        default: []
    },
    usageProofDescription: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('MoneyDonation', moneyDonationSchema);
