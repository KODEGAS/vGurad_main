"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    expert: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Question = (0, mongoose_1.model)('Question', questionSchema);
