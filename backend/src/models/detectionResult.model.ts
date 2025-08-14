import { Schema, model, Types } from 'mongoose';

export interface IDetectionResult {
  user_id: Types.ObjectId | string;
  disease_name?: string;
  crop_type?: string;
  confidence?: number;
  symptoms?: string[];
  treatment_suggestions?: string[];
  image_url?: string;
  detected_at: Date;
}

const detectionResultSchema = new Schema<IDetectionResult>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  disease_name: String,
  crop_type: String,
  confidence: Number,
  symptoms: [String],
  treatment_suggestions: [String],
  image_url: String,
  detected_at: { type: Date, required: true },
});

export const DetectionResult = model<IDetectionResult>('DetectionResult', detectionResultSchema);
