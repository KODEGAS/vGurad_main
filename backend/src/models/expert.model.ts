import { Schema, model } from 'mongoose';

export interface IExpert {
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  rating: number;
  phone: string;
  available: boolean;
}

const expertSchema = new Schema<IExpert>({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: String, required: true },
  languages: [{ type: String }],
  rating: { type: Number, required: true },
  phone: { type: String, required: true },
  available: { type: Boolean, required: true },
}, {
  timestamps: true,
});

export const Expert = model<IExpert>('Expert', expertSchema);
