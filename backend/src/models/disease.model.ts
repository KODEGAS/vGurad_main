import { Schema, model } from 'mongoose';

// Define the TypeScript interface for a Disease document
export interface IDisease {
  name: string;
  crop: string;
  symptoms: string[];
  cause: string;
  treatment: string;
  prevention: string;
  severity: 'High' | 'Medium' | 'Low';
}

// Define the Mongoose schema
const diseaseSchema = new Schema<IDisease>({
  name: { type: String, required: true },
  crop: { type: String, required: true },
  symptoms: [{ type: String }],
  cause: { type: String, required: true },
  treatment: { type: String, required: true },
  prevention: { type: String, required: true },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Mongoose model
export const Disease = model<IDisease>('Disease', diseaseSchema);
