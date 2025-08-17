import mongoose, { Schema, Document } from 'mongoose';

export interface IDetectionResult extends Document {
  user_id: mongoose.Types.ObjectId | string;
  image_url: string;
  detection_result: string;
  confidence_score: number;
  recommendations: string;
  created_at: Date;
  updated_at: Date;
}

const DetectionResultSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String, required: true },
  detection_result: { type: String, required: true },
  confidence_score: { type: Number, required: true },
  recommendations: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const DetectionResult = mongoose.model<IDetectionResult>('DetectionResult', DetectionResultSchema);
