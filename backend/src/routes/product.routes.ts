import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  updateProductApproval, 
  deleteProduct 
} from '../controllers/product.controller';

const router = express.Router();

// GET /api/products - Get all products (with optional approved filter)
router.get('/', getAllProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', updateProduct);

// PUT /api/products/:id/approval - Update product approval status
router.put('/:id/approval', updateProductApproval);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

export default router;
