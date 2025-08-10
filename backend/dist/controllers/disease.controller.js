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
exports.deleteDisease = exports.updateDisease = exports.createDisease = exports.getDiseaseById = exports.getDiseases = void 0;
const disease_model_1 = require("../models/disease.model");
// Fetch all diseases
const getDiseases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diseases = yield disease_model_1.Disease.find();
        res.status(200).json(diseases);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching diseases', error });
    }
});
exports.getDiseases = getDiseases;
// Fetch a single disease by ID
const getDiseaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disease = yield disease_model_1.Disease.findById(req.params.id);
        if (!disease) {
            return res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json(disease);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching disease', error });
    }
});
exports.getDiseaseById = getDiseaseById;
// Create a new disease
const createDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDisease = new disease_model_1.Disease(req.body);
        yield newDisease.save();
        res.status(201).json(newDisease);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating disease', error });
    }
});
exports.createDisease = createDisease;
// Update an existing disease
const updateDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedDisease = yield disease_model_1.Disease.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDisease) {
            return res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json(updatedDisease);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating disease', error });
    }
});
exports.updateDisease = updateDisease;
// Delete a disease
const deleteDisease = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDisease = yield disease_model_1.Disease.findByIdAndDelete(req.params.id);
        if (!deletedDisease) {
            return res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json({ message: 'Disease deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting disease', error });
    }
});
exports.deleteDisease = deleteDisease;
