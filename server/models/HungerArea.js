const mongoose = require("mongoose");

const hungerAreaSchema = new mongoose.Schema({
    areaName: String,
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: [Number]
    },
    totalMealsServed: Number,
    totalUnmetDemand: Number,
    hungerScore: Number,
    lastUpdated: { type: Date, default: Date.now }
});

hungerAreaSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("HungerArea", hungerAreaSchema);
