import { Router } from 'express';
import {
  getDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
} from '../controllers/disease.controller';

const router = Router();

router.get('/', getDiseases);
router.get('/:id', getDiseaseById);
router.post('/', createDisease);
router.put('/:id', updateDisease);
router.delete('/:id', deleteDisease);

export default router;