const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    areaName: String,
    hungerScore: Number,
    message: String,
    severity: { type: String, enum: ["low", "medium", "high"] },
    isResolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
