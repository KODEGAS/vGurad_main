"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importStar(require("express"));
const disease_controller_1 = require("./disease.controller");
const disease_model_1 = require("../models/disease.model");
// Mock the Disease model
jest.mock('../models/disease.model');
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.get('/api/diseases', disease_controller_1.getDiseases);
app.get('/api/diseases/:id', disease_controller_1.getDiseaseById);
app.post('/api/diseases', disease_controller_1.createDisease);
app.put('/api/diseases/:id', disease_controller_1.updateDisease);
app.delete('/api/diseases/:id', disease_controller_1.deleteDisease);
describe('Disease Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getDiseases', () => {
        it('should return a list of diseases with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDiseases = [
                { name: 'Blight', description: 'A common plant disease' },
                { name: 'Rust', description: 'A fungal disease' },
            ];
            disease_model_1.Disease.find.mockResolvedValue(mockDiseases);
            const response = yield (0, supertest_1.default)(app).get('/api/diseases');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDiseases);
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).get('/api/diseases');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching diseases', error: {} });
        }));
    });
    describe('getDiseaseById', () => {
        it('should return a single disease with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDisease = { name: 'Blight', description: 'A common plant disease' };
            disease_model_1.Disease.findById.mockResolvedValue(mockDisease);
            const response = yield (0, supertest_1.default)(app).get('/api/diseases/123');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDisease);
        }));
        it('should return a 404 status code if the disease is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).get('/api/diseases/123');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Disease not found' });
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findById.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).get('/api/diseases/123');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching disease', error: {} });
        }));
    });
    describe('createDisease', () => {
        it('should create a new disease and return it with a 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const newDisease = { name: 'Powdery Mildew', description: 'A fungal disease' };
            const mockSavedDisease = Object.assign(Object.assign({}, newDisease), { save: jest.fn().mockResolvedValue(newDisease) });
            disease_model_1.Disease.mockImplementation(() => mockSavedDisease);
            const response = yield (0, supertest_1.default)(app).post('/api/diseases').send(newDisease);
            expect(response.status).toBe(201);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { save } = mockSavedDisease, expectedDisease = __rest(mockSavedDisease, ["save"]);
            expect(response.body).toEqual(expectedDisease);
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const newDisease = { name: 'Powdery Mildew', description: 'A fungal disease' };
            const mockSavedDisease = Object.assign(Object.assign({}, newDisease), { save: jest.fn().mockRejectedValue(new Error('Database error')) });
            disease_model_1.Disease.mockImplementation(() => mockSavedDisease);
            const response = yield (0, supertest_1.default)(app).post('/api/diseases').send(newDisease);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error creating disease', error: {} });
        }));
    });
    describe('updateDisease', () => {
        it('should update a disease and return it with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedDisease = { name: 'Blight', description: 'An updated description' };
            disease_model_1.Disease.findByIdAndUpdate.mockResolvedValue(updatedDisease);
            const response = yield (0, supertest_1.default)(app).put('/api/diseases/123').send(updatedDisease);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedDisease);
        }));
        it('should return a 404 status code if the disease to update is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findByIdAndUpdate.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).put('/api/diseases/123').send({});
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Disease not found' });
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).put('/api/diseases/123').send({});
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error updating disease', error: {} });
        }));
    });
    describe('deleteDisease', () => {
        it('should delete a disease and return a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findByIdAndDelete.mockResolvedValue({ name: 'Blight' });
            const response = yield (0, supertest_1.default)(app).delete('/api/diseases/123');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Disease deleted successfully' });
        }));
        it('should return a 404 status code if the disease to delete is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findByIdAndDelete.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).delete('/api/diseases/123');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Disease not found' });
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            disease_model_1.Disease.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).delete('/api/diseases/123');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error deleting disease', error: {} });
        }));
    });
});
