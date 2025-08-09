import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database';
import diseaseRoutes from './routes/disease.routes';
import tipRoutes from './routes/tip.routes';
import expertRoutes from './routes/expert.routes';
import questionRoutes from './routes/question.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/diseases', diseaseRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/questions', questionRoutes);

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { userPrompt, expertName } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ success: false, error: 'User prompt is required.' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const chatHistory = [
    {
      role: 'user',
      parts: [
        {
          text: `You are an agricultural expert${expertName ? ` named ${expertName}` : ''}. 
                 Respond to the user's question in a professional, empathetic, and knowledgeable manner. 
                 User's question: ${userPrompt}`
        }
      ]
    }
  ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: chatHistory })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API returned error:', errorText);
      return res.status(response.status).json({ success: false, error: 'Gemini API call failed.' });
    }

    const result = await response.json() as {
      candidates?: Array<{
        content?: {
          parts: Array<{ text: string }>
        }
      }>
    };

    const expertResponseText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (expertResponseText) {
      return res.json({ success: true, response: expertResponseText });
    } else {
      console.error('Unexpected Gemini API response:', JSON.stringify(result, null, 2));
      return res.status(500).json({ success: false, error: 'No valid text in Gemini response.' });
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
