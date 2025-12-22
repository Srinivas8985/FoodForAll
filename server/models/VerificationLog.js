const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['verified', 'rejected'],
        required: true
    },
    verificationMethod: {
        type: String,
        enum: ['phone', 'visit', 'document_check', 'dashboard'],
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VerificationLog', verificationLogSchema);
