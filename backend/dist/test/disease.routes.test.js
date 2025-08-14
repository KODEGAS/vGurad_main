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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const disease_routes_1 = __importDefault(require("../routes/disease.routes"));
const disease_model_1 = require("../models/disease.model");
// Mock the Disease model
jest.mock('../models/disease.model');
const mockDisease = disease_model_1.Disease;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/diseases', disease_routes_1.default);
describe('Disease API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /api/diseases', () => {
        it('should return all diseases', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDiseases = [
                {
                    _id: '1',
                    name: 'Leaf Spot',
                    description: 'Common leaf disease',
                    symptoms: ['Brown spots on leaves'],
                    treatment: 'Apply fungicide',
                    prevention: 'Proper spacing',
                    affectedCrops: ['Tomato', 'Potato'],
                    severity: 'Medium',
                    imageUrl: 'http://example.com/image.jpg'
                },
                {
                    _id: '2',
                    name: 'Powdery Mildew',
                    description: 'Fungal disease',
                    symptoms: ['White powdery coating'],
                    treatment: 'Apply sulfur spray',
                    prevention: 'Good air circulation',
                    affectedCrops: ['Cucumber', 'Squash'],
                    severity: 'High',
                    imageUrl: 'http://example.com/image2.jpg'
                }
            ];
            mockDisease.find.mockResolvedValue(mockDiseases);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases')
                .expect(200);
            expect(response.body).toEqual(mockDiseases);
            expect(mockDisease.find).toHaveBeenCalledTimes(1);
        }));
        it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDisease.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases')
                .expect(500);
            expect(response.body.message).toBe('Error fetching diseases');
        }));
    });
    describe('GET /api/diseases/:id', () => {
        it('should return a specific disease', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDisease_data = {
                _id: '1',
                name: 'Leaf Spot',
                description: 'Common leaf disease',
                symptoms: ['Brown spots on leaves'],
                treatment: 'Apply fungicide',
                prevention: 'Proper spacing',
                affectedCrops: ['Tomato', 'Potato'],
                severity: 'Medium',
                imageUrl: 'http://example.com/image.jpg'
            };
            mockDisease.findById.mockResolvedValue(mockDisease_data);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases/1')
                .expect(200);
            expect(response.body).toEqual(mockDisease_data);
            expect(mockDisease.findById).toHaveBeenCalledWith('1');
        }));
        it('should return 404 for non-existent disease', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDisease.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases/nonexistent')
                .expect(404);
            expect(response.body.message).toBe('Disease not found');
        }));
    });
    describe('GET /api/diseases/search/:crop', () => {
        it('should return diseases for specific crop', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDiseases = [
                {
                    _id: '1',
                    name: 'Tomato Blight',
                    affectedCrops: ['Tomato'],
                    severity: 'High'
                }
            ];
            mockDisease.find.mockResolvedValue(mockDiseases);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases/search/Tomato')
                .expect(200);
            expect(response.body).toEqual(mockDiseases);
            expect(mockDisease.find).toHaveBeenCalledWith({
                affectedCrops: { $in: ['Tomato'] }
            });
        }));
        it('should return empty array for crops with no diseases', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDisease.find.mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/diseases/search/UnknownCrop')
                .expect(200);
            expect(response.body).toEqual([]);
        }));
    });
    describe('POST /api/diseases', () => {
        it('should create a new disease', () => __awaiter(void 0, void 0, void 0, function* () {
            const newDiseaseData = {
                name: 'New Disease',
                description: 'Test disease',
                symptoms: ['Test symptom'],
                treatment: 'Test treatment',
                prevention: 'Test prevention',
                affectedCrops: ['Test Crop'],
                severity: 'Low'
            };
            const savedDisease = Object.assign({ _id: '123' }, newDiseaseData);
            mockDisease.prototype.save = jest.fn().mockResolvedValue(savedDisease);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/diseases')
                .send(newDiseaseData)
                .expect(201);
            expect(response.body).toEqual(savedDisease);
        }));
        it('should handle validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = {
                name: '', // Empty name should cause validation error
                description: 'Test'
            };
            mockDisease.prototype.save = jest.fn().mockRejectedValue(new Error('Validation failed'));
            const response = yield (0, supertest_1.default)(app)
                .post('/api/diseases')
                .send(invalidData)
                .expect(400);
            expect(response.body.message).toBe('Error creating disease');
        }));
    });
});
