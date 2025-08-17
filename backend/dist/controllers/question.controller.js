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
exports.createQuestion = exports.getQuestions = void 0;
const question_model_1 = require("../models/question.model");
// Fetch all questions
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_model_1.Question.find();
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
});
exports.getQuestions = getQuestions;
// Submit a new question
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Note: In a real app, you'd associate this with a user ID
        const newQuestion = new question_model_1.Question(Object.assign(Object.assign({}, req.body), { status: 'pending', date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) }));
        yield newQuestion.save();
        res.status(201).json(newQuestion);
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting question', error });
    }
});
exports.createQuestion = createQuestion;
