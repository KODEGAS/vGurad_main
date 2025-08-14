import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in the environment variables. Please check your .env file.");
    }

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables. Please check your .env file.");
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB cloud database connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
