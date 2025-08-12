import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database';
import diseaseRoutes from './routes/disease.routes';
import tipRoutes from './routes/tip.routes';
import expertRoutes from './routes/expert.routes';
import questionRoutes from './routes/question.routes';
import treatmentRoutes from './routes/treatment.routes';
import productRoutes from './routes/product.routes';
import geminiProxyRoute from './routes/gemini-proxy.route';
import { admin, auth } from './firebase-admin';
import { userModel } from './models/User';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;



const firebaseAdmin = admin;
// Connect to the database
connectDB();

// Middleware
if (process.env.NODE_ENV === 'dev') {
  app.use(cors());
}

app.use(express.json());
// Middleware to verify Firebase ID token and fetch user profile
const verifyAndFetchUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Route to create user profile after Firebase sign-up
app.post('/api/auth/create-user-profile', verifyAndFetchUser, async (req: any, res) => {
  try {
    const { email } = req.body;
    const firebaseUid = req.user.uid;

    const existingUser = await userModel.findOne({ firebaseUid });
    if (existingUser) {
      // User already exists, perhaps from a previous Google sign-in
      return res.status(409).json({ message: 'User profile already exists.' });
    }

    const newUser = new userModel({
      firebaseUid,
      email,
      role: 'user', // Assign a default role
      createdAt: new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: 'User profile created successfully.', user: newUser });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// GET user profile
app.get('/api/user-profile', verifyAndFetchUser, async (req: any, res) => {
  try {
    const userProfile = await userModel.findOne({ firebaseUid: req.user.uid });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PUT user profile (update)
app.put('/api/user-profile', verifyAndFetchUser, async (req: any, res) => {
  try {
    const { full_name, phone, location, language_preference } = req.body;
    const userProfile = await userModel.findOne({ firebaseUid: req.user.uid });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
  if (full_name !== undefined) userProfile.displayName = full_name;
  if (phone !== undefined) userProfile.phone = phone;
  if (location !== undefined) userProfile.location = location;
  if (language_preference !== undefined) userProfile.language_preference = language_preference;
    await userProfile.save();
    res.json(userProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/test', (req, res) => res.send('API is working'));
app.get('/gemini', (req, res) => res.send(process.env.GEMINI_API_KEY || 'No API Key Found'));

// API Routes

app.use('/api/diseases', diseaseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/gemini-proxy', geminiProxyRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
