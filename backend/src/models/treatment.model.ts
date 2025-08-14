import mongoose, { Schema, Document } from 'mongoose';

export interface ITreatment extends Document {
  treatment_name: string;
  schedule_date: string;
  dosage: string;
  status: 'pending' | 'completed' | 'missed';
  notes?: string;
  photo_url?: string;
}

const TreatmentSchema: Schema = new Schema({
  treatment_name: { type: String, required: true },
  schedule_date: { type: String, required: true },
  dosage: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'missed'], default: 'pending' },
  notes: { type: String },
  photo_url: { type: String },
});

export const Treatment = mongoose.model<ITreatment>('Treatment', TreatmentSchema);
