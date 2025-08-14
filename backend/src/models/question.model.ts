import { Schema, model } from 'mongoose';

export interface IQuestion {
  question: string;
  expert: string;
  status: 'pending' | 'answered';
  date: string; 
}


const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  expert: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
});

export const Question = model<IQuestion>('Question', questionSchema);
