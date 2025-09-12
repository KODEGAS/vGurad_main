import mongoose, { Schema, Document } from 'mongoose';

export interface IPaddyPrice extends Document {
  Name: string;
  Price: number;
  Location: string;
}

const PaddyPriceSchema: Schema = new Schema({
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  Location: { type: String, required: true },
});

export default mongoose.model<IPaddyPrice>('PaddyPrice', PaddyPriceSchema, 'paddyPrices');
