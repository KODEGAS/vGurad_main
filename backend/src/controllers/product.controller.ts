import { Request, Response } from 'express';
import { Product } from '../models/product.model';

// Get all products (with optional filter for approved only)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { approved } = req.query;
    let filter = {};
    
    if (approved === 'true') {
      filter = { is_approved: true };
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      price,
      currency,
      dosage_instructions,
      seller_name,
      seller_contact,
      seller_location,
      image_url,
      stock_quantity,
      is_approved
    } = req.body;

    if (!name || !category || !price || !seller_name || !seller_contact || !seller_location) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      currency: currency || 'LKR',
      dosage_instructions,
      seller_name,
      seller_contact,
      seller_location,
      image_url,
      stock_quantity: stock_quantity || 0,
      is_approved: is_approved || false
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};

// Update product approval status
export const updateProductApproval = async (req: Request, res: Response) => {
  try {
    const { is_approved } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_approved },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product approval', error: err });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};
