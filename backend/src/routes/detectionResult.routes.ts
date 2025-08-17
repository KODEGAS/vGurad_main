import { Router } from 'express';
import { 
  getDetectionResultsByUser, 
  createDetectionResult, 
  getDetectionResultById, 
  deleteDetectionResult 
} from '../controllers/detectionResult.controller';

const router = Router();

router.get('/', getDetectionResultsByUser);
router.post('/', createDetectionResult);
router.get('/:id', getDetectionResultById);
router.delete('/:id', deleteDetectionResult);

export default router;
