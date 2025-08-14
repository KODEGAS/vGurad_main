"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tip = void 0;
const mongoose_1 = require("mongoose");
const tipSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    season: { type: String, required: true },
    icon: { type: String, required: true },
    content: [{ type: String }],
    timing: { type: String },
}, {
    timestamps: true,
});
exports.Tip = (0, mongoose_1.model)('Tip', tipSchema);
