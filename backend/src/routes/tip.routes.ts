import { Router } from 'express';
import { getTips } from '../controllers/tip.controller';

const router = Router();

router.get('/', getTips);

export default router;
