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
const question_controller_1 = require("./question.controller");
const question_model_1 = require("../models/question.model");
// Mock the Question model
jest.mock('../models/question.model');
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.get('/api/questions', question_controller_1.getQuestions);
app.post('/api/questions', question_controller_1.createQuestion);
describe('Question Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getQuestions', () => {
        it('should return a list of questions with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockQuestions = [
                { question: 'What is the best fertilizer for tomatoes?' },
                { question: 'How to control pests in my garden?' },
            ];
            question_model_1.Question.find.mockResolvedValue(mockQuestions);
            const response = yield (0, supertest_1.default)(app).get('/api/questions');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockQuestions);
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            question_model_1.Question.find.mockRejectedValue(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).get('/api/questions');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching questions', error: {} });
        }));
    });
    describe('createQuestion', () => {
        it('should create a new question and return it with a 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const newQuestion = { question: 'How to grow organic vegetables?' };
            const mockSavedQuestion = Object.assign(Object.assign({}, newQuestion), { status: 'pending', date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }), save: jest.fn().mockResolvedValue(newQuestion) });
            question_model_1.Question.mockImplementation(() => mockSavedQuestion);
            const response = yield (0, supertest_1.default)(app).post('/api/questions').send(newQuestion);
            expect(response.status).toBe(201);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { save } = mockSavedQuestion, expectedQuestion = __rest(mockSavedQuestion, ["save"]);
            expect(response.body).toEqual(expectedQuestion);
        }));
        it('should return a 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const newQuestion = { question: 'How to grow organic vegetables?' };
            const mockSavedQuestion = Object.assign(Object.assign({}, newQuestion), { save: jest.fn().mockRejectedValue(new Error('Database error')) });
            question_model_1.Question.mockImplementation(() => mockSavedQuestion);
            const response = yield (0, supertest_1.default)(app).post('/api/questions').send(newQuestion);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error submitting question', error: {} });
        }));
    });
});
