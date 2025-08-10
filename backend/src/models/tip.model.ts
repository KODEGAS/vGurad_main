import { Schema, model } from 'mongoose';

export interface ITip {
  title: string;
  category: string;
  season: string;
  icon: string;
  content: string[];
  timing: string;
}

const tipSchema = new Schema<ITip>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  season: { type: String, required: true },
  icon: { type: String, required: true },
  content: [{ type: String }],
  timing: { type: String },
}, {
  timestamps: true,
});

export const Tip = model<ITip>('Tip', tipSchema);
