import mongoose, { Document, Schema } from 'mongoose';

// 1. Create an interface to represent the document in MongoDB.
export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  role: 'admin' | 'proUser' | 'user';
  createdAt: Date;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  language_preference?: 'en' | 'si' | 'ta';
}

// 2. Define the schema
const userSchema: Schema = new Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'proUser', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  displayName: {
    type: String,
    default: '',
  },
  photoURL: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  language_preference: {
    type: String,
    enum: ['en', 'si', 'ta'],
    default: 'en',
  },
  savedNotes: [{ type: Schema.Types.ObjectId, ref: 'Note' }], // Array of saved note ObjectIds
});

// 3. Export the model, using the IUser interface
const userModel = mongoose.model<IUser>('User', userSchema);
export { userModel };
