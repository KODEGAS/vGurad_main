import express from 'express';
import PaddyPrice from '../models/paddyPrice.model';

const router = express.Router();

// GET /api/paddy-prices
router.get('/', async (req, res) => {
  try {
    console.log('Fetching paddy prices...');
    const prices = await PaddyPrice.find();
    console.log(`Found ${prices.length} paddy prices`);
    console.log('Sample data:', prices.slice(0, 2)); // Log first 2 items for debugging
    res.json(prices);
  } catch (error) {
    console.error('Error fetching paddy prices:', error);
    res.status(500).json({ message: 'Failed to fetch paddy prices', error });
  }
});

export default router;
