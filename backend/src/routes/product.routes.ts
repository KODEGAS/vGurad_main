import express from 'express';
import { Product } from '../models/product.model';

const router = express.Router();

// GET /api/products - Get all approved products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ is_approved: true }).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

export default router;
