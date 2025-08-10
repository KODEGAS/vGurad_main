"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("../controllers/question.controller");
const router = (0, express_1.Router)();
router.get('/', question_controller_1.getQuestions);
router.post('/', question_controller_1.createQuestion);
exports.default = router;
