const mongoose = require("mongoose");

const distributionSchema = new mongoose.Schema({
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    areaName: String,
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }
    },
    date: { type: Date, required: true },
    mealsDistributed: { type: Number, required: true },
    unmetDemand: { type: Number, required: true },
    foodType: { type: String, enum: ["dry", "cooked", "packed"] },
    targetGroup: { type: String, enum: ["children", "homeless", "elderly", "mixed"] },
    createdAt: { type: Date, default: Date.now }
});

distributionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Distribution", distributionSchema);
