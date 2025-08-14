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
const tip_routes_1 = __importDefault(require("../routes/tip.routes"));
const tip_model_1 = require("../models/tip.model");
// Mock the Tip model
jest.mock('../models/tip.model');
const mockTip = tip_model_1.Tip;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/tips', tip_routes_1.default);
describe('Tip API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /api/tips', () => {
        it('should return all tips', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTips = [
                {
                    _id: '1',
                    title: 'Proper Watering Techniques',
                    content: 'Water your crops early in the morning...',
                    category: 'Irrigation',
                    season: 'Summer',
                    difficulty: 'Easy',
                    estimatedTime: '10 minutes',
                    tools: ['Watering can', 'Hose'],
                    crops: ['Tomato', 'Cucumber'],
                    tags: ['watering', 'irrigation'],
                    author: 'Farm Expert',
                    dateCreated: new Date('2024-01-01'),
                    likes: 25,
                    views: 150
                }
            ];
            mockTip.find.mockResolvedValue(mockTips);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips')
                .expect(200);
            expect(response.body).toEqual(mockTips);
            expect(mockTip.find).toHaveBeenCalledTimes(1);
        }));
        it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTip.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips')
                .expect(500);
            expect(response.body.message).toBe('Error fetching tips');
        }));
    });
    describe('GET /api/tips/:id', () => {
        it('should return a specific tip', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTipData = {
                _id: '1',
                title: 'Proper Watering Techniques',
                content: 'Water your crops early in the morning...',
                category: 'Irrigation',
                season: 'Summer',
                difficulty: 'Easy'
            };
            mockTip.findById.mockResolvedValue(mockTipData);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips/1')
                .expect(200);
            expect(response.body).toEqual(mockTipData);
            expect(mockTip.findById).toHaveBeenCalledWith('1');
        }));
        it('should return 404 for non-existent tip', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTip.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips/nonexistent')
                .expect(404);
            expect(response.body.message).toBe('Tip not found');
        }));
    });
    describe('GET /api/tips/category/:category', () => {
        it('should return tips by category', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTips = [
                {
                    _id: '1',
                    title: 'Watering Tips',
                    category: 'Irrigation'
                }
            ];
            mockTip.find.mockResolvedValue(mockTips);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips/category/Irrigation')
                .expect(200);
            expect(response.body).toEqual(mockTips);
            expect(mockTip.find).toHaveBeenCalledWith({
                category: { $regex: 'Irrigation', $options: 'i' }
            });
        }));
    });
    describe('GET /api/tips/season/:season', () => {
        it('should return tips by season', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTips = [
                {
                    _id: '1',
                    title: 'Summer Care',
                    season: 'Summer'
                }
            ];
            mockTip.find.mockResolvedValue(mockTips);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/tips/season/Summer')
                .expect(200);
            expect(response.body).toEqual(mockTips);
            expect(mockTip.find).toHaveBeenCalledWith({
                season: { $regex: 'Summer', $options: 'i' }
            });
        }));
    });
    describe('POST /api/tips', () => {
        it('should create a new tip', () => __awaiter(void 0, void 0, void 0, function* () {
            const newTipData = {
                title: 'New Farming Tip',
                content: 'This is a new tip...',
                category: 'General',
                season: 'All',
                difficulty: 'Medium',
                estimatedTime: '30 minutes',
                tools: ['Shovel'],
                crops: ['Corn'],
                tags: ['farming'],
                author: 'Test Author'
            };
            const savedTip = Object.assign({ _id: '123' }, newTipData);
            mockTip.prototype.save = jest.fn().mockResolvedValue(savedTip);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/tips')
                .send(newTipData)
                .expect(201);
            expect(response.body).toEqual(savedTip);
        }));
        it('should handle validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = {
                title: '', // Empty title should cause validation error
                content: 'Test content'
            };
            mockTip.prototype.save = jest.fn().mockRejectedValue(new Error('Validation failed'));
            const response = yield (0, supertest_1.default)(app)
                .post('/api/tips')
                .send(invalidData)
                .expect(400);
            expect(response.body.message).toBe('Error creating tip');
        }));
    });
    describe('POST /api/tips/:id/like', () => {
        it('should increment likes for a tip', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTip_data = {
                _id: '1',
                title: 'Test Tip',
                likes: 5,
                save: jest.fn()
            };
            mockTip.findById.mockResolvedValue(mockTip_data);
            mockTip_data.save.mockResolvedValue(Object.assign(Object.assign({}, mockTip_data), { likes: 6 }));
            const response = yield (0, supertest_1.default)(app)
                .post('/api/tips/1/like')
                .expect(200);
            expect(response.body.likes).toBe(6);
            expect(mockTip_data.save).toHaveBeenCalledTimes(1);
        }));
        it('should return 404 for non-existent tip', () => __awaiter(void 0, void 0, void 0, function* () {
            mockTip.findById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/tips/nonexistent/like')
                .expect(404);
            expect(response.body.message).toBe('Tip not found');
        }));
    });
});
