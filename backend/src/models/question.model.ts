import { Schema, model } from 'mongoose';

// Define the TypeScript interface for a Question document
export interface IQuestion {
  question: string;
  expert: string;
  status: 'pending' | 'answered';
  date: string; // Storing date as a string for simplicity, can be Date type
}

// Define the Mongoose schema
const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  expert: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
});

export const Question = model<IQuestion>('Question', questionSchema);
