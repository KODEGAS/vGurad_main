import { Router } from 'express';
import { getQuestions, createQuestion } from '../controllers/question.controller';

const router = Router();
router.get('/', getQuestions);
router.post('/', createQuestion);

export default router;