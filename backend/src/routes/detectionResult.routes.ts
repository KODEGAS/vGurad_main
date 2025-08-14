import { Router } from 'express';
import { getDetectionResults, createDetectionResult } from '../controllers/detectionResult.controller';

const router = Router();

router.get('/', getDetectionResults);
router.post('/', createDetectionResult);

export default router;
