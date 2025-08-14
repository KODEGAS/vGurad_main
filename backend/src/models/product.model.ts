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
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  dosage_instructions: { type: String },
  seller_name: { type: String, required: true },
  seller_contact: { type: String, required: true },
  seller_location: { type: String, required: true },
  image_url: { type: String },
  stock_quantity: { type: Number, required: true },
  is_approved: { type: Boolean, default: false },
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
