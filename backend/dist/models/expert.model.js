"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expert = void 0;
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const expertSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    languages: [{ type: String }],
    rating: { type: Number, required: true },
    phone: { type: String, required: true },
    available: { type: Boolean, required: true },
}, {
    timestamps: true,
});
exports.Expert = (0, mongoose_1.model)('Expert', expertSchema);
