import { Router } from 'express';
import { getExperts } from '../controllers/expert.controller';

const router = Router();
router.get('/', getExperts);

export default router;