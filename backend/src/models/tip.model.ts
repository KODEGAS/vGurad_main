import { Schema, model } from 'mongoose';

// Define the TypeScript interface for a Tip document
export interface ITip {
  title: string;
  category: string;
  season: string;
  icon: string; // Storing the icon name as a string
  content: string[];
  timing: string;
}

// Define the Mongoose schema
const tipSchema = new Schema<ITip>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  season: { type: String, required: true },
  icon: { type: String, required: true }, // Store icon name as a string
  content: [{ type: String }],
  timing: { type: String },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Mongoose model
export const Tip = model<ITip>('Tip', tipSchema);
