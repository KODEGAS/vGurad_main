"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disease = void 0;
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const diseaseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    crop: { type: String, required: true },
    symptoms: [{ type: String }],
    cause: { type: String, required: true },
    treatment: { type: String, required: true },
    prevention: { type: String, required: true },
    severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    image_url: { type: String, required: false },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
exports.Disease = (0, mongoose_1.model)('Disease', diseaseSchema);
