import express from 'express';
import { Treatment } from '../models/treatment.model';

const router = express.Router();

// GET /api/treatments - Get all treatments
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.find().sort({ schedule_date: 1 });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching treatments', error });
  }
});

// PATCH /api/treatments/:id/complete - Mark a treatment as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });
    res.json(treatment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating treatment', error });
  }
});

export default router;
