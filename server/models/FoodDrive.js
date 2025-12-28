const mongoose = require("mongoose");

const foodDriveSchema = new mongoose.Schema({
    areaName: String,
    address: String,
    pincode: String,
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: [Number]
    },
    plannedMeals: Number,
    assignedNGOs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    driveDate: Date,
    status: { type: String, enum: ["planned", "ongoing", "completed"], default: "planned" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FoodDrive", foodDriveSchema);
