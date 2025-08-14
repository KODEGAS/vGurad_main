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
const tip_controller_1 = require("./tip.controller");
const tip_model_1 = require("../models/tip.model");
// Mock the Tip model
jest.mock('../models/tip.model');
const app = (0, express_1.default)();
app.get('/api/tips', tip_controller_1.getTips);
describe('Tip Controller', () => {
    describe('getTips', () => {
        it('should return a list of tips with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTips = [
                { title: 'Watering your plants', content: 'Water them in the morning.' },
                { title: 'Soil health', content: 'Use compost to enrich your soil.' },
            ];
            tip_model_1.Tip.find.mockResolvedValue(mockTips);
            const response = yield (0, supertest_1.default)(app).get('/api/tips');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTips);
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            tip_model_1.Tip.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).get('/api/tips');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching tips', error: {} });
        }));
    });
});
