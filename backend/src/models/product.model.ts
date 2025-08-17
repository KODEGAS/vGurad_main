import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  dosage_instructions: string;
  seller_name: string;
  seller_contact: string;
  seller_location: string;
  image_url?: string;
  stock_quantity: number;
  is_approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'LKR' },
  dosage_instructions: { type: String },
  seller_name: { type: String, required: true },
  seller_contact: { type: String, required: true },
  seller_location: { type: String, required: true },
  image_url: { type: String },
  stock_quantity: { type: Number, required: true, default: 0 },
  is_approved: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
