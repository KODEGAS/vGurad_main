import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';

// Extend Request interface to include file
interface MulterRequest extends Request {
  file?: any; // Use any as a temporary fix for the Express.Multer.File type
}

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
}).single('file');

// Error handling middleware for multer
const handleMulterErrors = (req: Request, res: Response, next: Function) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 25MB.' });
      }
      return res.status(400).json({ error: 'File upload error: ' + (err.message || 'Unknown error') });
    }
    next();
  });
};

const CROP_API_BASE_URL = 'https://api.weguard.kodegas.com';

// Proxy route for crop prediction
router.post('/predict', handleMulterErrors, async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create FormData for the external API
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Forward request to external API using axios
    const response = await axios.post(`${CROP_API_BASE_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Error in crop prediction proxy:', error.message);
    res.status(500).json({ error: 'Failed to process image prediction' });
  }
});

// Proxy route for disease information
router.get('/disease-info/:diseaseName', async (req: Request, res: Response) => {
  try {
    const { diseaseName } = req.params;
    const encodedName = encodeURIComponent(diseaseName);
    
    const response = await axios.get(`${CROP_API_BASE_URL}/disease-info/${encodedName}`, {
      timeout: 10000, // 10 second timeout
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error in disease info proxy:', error.message);
    res.status(500).json({ error: 'Failed to fetch disease information' });
  }
});

// Proxy route for disease medicines
router.get('/disease-medicines', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Disease name is required' });
    }

    const encodedName = encodeURIComponent(name as string);
    const response = await axios.get(`${CROP_API_BASE_URL}/disease-medicines?name=${encodedName}`, {
      timeout: 10000, // 10 second timeout
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error in disease medicines proxy:', error.message);
    res.status(500).json({ error: 'Failed to fetch disease medicines' });
  }
});

export default router;
