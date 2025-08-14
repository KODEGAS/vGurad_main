"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tip = void 0;
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const tipSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    season: { type: String, required: true },
    icon: { type: String, required: true }, // Store icon name as a string
    content: [{ type: String }],
    timing: { type: String },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Export the Mongoose model
exports.Tip = (0, mongoose_1.model)('Tip', tipSchema);
