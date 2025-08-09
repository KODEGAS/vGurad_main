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
const expert_routes_1 = __importDefault(require("../routes/expert.routes"));
const expert_model_1 = require("../models/expert.model");
// Mock the Expert model
jest.mock('../models/expert.model');
const mockExpert = expert_model_1.Expert;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/experts', expert_routes_1.default);
describe('Expert API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /api/experts', () => {
        it('should return all experts', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockExperts = [
                {
                    _id: '1',
                    name: 'Dr. John Smith',
                    specialization: 'Plant Pathology',
                    experience: 15,
                    email: 'john@example.com',
                    phone: '+1234567890',
                    location: 'California, USA',
                    languages: ['English', 'Spanish'],
                    availability: 'Available',
                    rating: 4.8,
                    consultationFee: 100
                },
                {
                    _id: '2',
                    name: 'Dr. Sarah Johnson',
                    specialization: 'Crop Science',
                    experience: 12,
                    email: 'sarah@example.com',
                    phone: '+1234567891',
                    location: 'Texas, USA',
                    languages: ['English'],
                    availability: 'Busy',
                    rating: 4.6,
                    consultationFee: 85
                }
            ];
            mockExpert.find.mockResolvedValue(mockExperts);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts')
                .expect(200);
            expect(response.body).toEqual(mockExperts);
            expect(mockExpert.find).toHaveBeenCalledTimes(1);
        }));
        it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
            mockExpert.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts')
                .expect(500);
            expect(response.body.message).toBe('Error fetching experts');
        }));
    });
    describe('GET /api/experts/:id', () => {
        it('should return a specific expert', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockExpertData = {
                _id: '1',
                name: 'Dr. John Smith',
                specialization: 'Plant Pathology',
                experience: 15,
                email: 'john@example.com',
                phone: '+1234567890',
                location: 'California, USA',
                languages: ['English', 'Spanish'],
                availability: 'Available',
                rating: 4.8,
                consultationFee: 100
            };
            mockExpert.findById.mockResolvedValue(mockExpertData);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts/1')
                .expect(200);
            expect(response.body).toEqual(mockExpertData);
            expect(mockExpert.findById).toHaveBeenCalledWith('1');
        }));
        it('should return 404 for non-existent expert', () => __awaiter(void 0, void 0, void 0, function* () {
            mockExpert.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts/nonexistent')
                .expect(404);
            expect(response.body.message).toBe('Expert not found');
        }));
    });
    describe('GET /api/experts/specialization/:spec', () => {
        it('should return experts by specialization', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockExperts = [
                {
                    _id: '1',
                    name: 'Dr. John Smith',
                    specialization: 'Plant Pathology'
                }
            ];
            mockExpert.find.mockResolvedValue(mockExperts);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts/specialization/Plant%20Pathology')
                .expect(200);
            expect(response.body).toEqual(mockExperts);
            expect(mockExpert.find).toHaveBeenCalledWith({
                specialization: { $regex: 'Plant Pathology', $options: 'i' }
            });
        }));
    });
    describe('GET /api/experts/available', () => {
        it('should return only available experts', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAvailableExperts = [
                {
                    _id: '1',
                    name: 'Dr. John Smith',
                    availability: 'Available'
                }
            ];
            mockExpert.find.mockResolvedValue(mockAvailableExperts);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/experts/available')
                .expect(200);
            expect(response.body).toEqual(mockAvailableExperts);
            expect(mockExpert.find).toHaveBeenCalledWith({
                availability: 'Available'
            });
        }));
    });
    describe('POST /api/experts', () => {
        it('should create a new expert', () => __awaiter(void 0, void 0, void 0, function* () {
            const newExpertData = {
                name: 'Dr. New Expert',
                specialization: 'Entomology',
                experience: 8,
                email: 'new@example.com',
                phone: '+1234567892',
                location: 'Florida, USA',
                languages: ['English'],
                availability: 'Available',
                rating: 4.5,
                consultationFee: 75
            };
            const savedExpert = Object.assign({ _id: '123' }, newExpertData);
            mockExpert.prototype.save = jest.fn().mockResolvedValue(savedExpert);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/experts')
                .send(newExpertData)
                .expect(201);
            expect(response.body).toEqual(savedExpert);
        }));
        it('should handle validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = {
                name: '', // Empty name should cause validation error
                specialization: 'Test'
            };
            mockExpert.prototype.save = jest.fn().mockRejectedValue(new Error('Validation failed'));
            const response = yield (0, supertest_1.default)(app)
                .post('/api/experts')
                .send(invalidData)
                .expect(400);
            expect(response.body.message).toBe('Error creating expert');
        }));
    });
});
