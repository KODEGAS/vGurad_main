import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ text });
  } catch (err) {
    const error = err as any;
    console.error('Error with Gemini API:', error);
    if (error.response) {
      console.error('Gemini API response:', error.response.data);
    }
    res.status(500).json({ 
      message: 'Failed to get response from Gemini',
      error: error.message || error.toString()
    });
  }
});

export default router;
