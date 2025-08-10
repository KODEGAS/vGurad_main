"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExperts = void 0;
const expert_model_1 = require("../models/expert.model");
// Fetch all experts
const getExperts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experts = yield expert_model_1.Expert.find();
        res.status(200).json(experts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching experts', error });
    }
});
exports.getExperts = getExperts;
