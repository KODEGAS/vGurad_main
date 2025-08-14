import { Schema, model, Types } from 'mongoose';

export interface INote {
  user_id: Types.ObjectId | string;
  title: string;
  content: string;
  created_at: Date;
}

const noteSchema = new Schema<INote>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Note = model<INote>('Note', noteSchema);
