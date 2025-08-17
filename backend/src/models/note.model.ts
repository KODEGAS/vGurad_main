import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  user_id: mongoose.Types.ObjectId | string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const NoteSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Note = mongoose.model<INote>('Note', NoteSchema);
