import { Request, Response } from 'express';
import { DetectionResult } from '../models/detectionResult.model';

// Get all detection results for a user
export const getDetectionResults = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id || req.body.user_id;
    if (!userId) return res.status(400).json({ message: 'user_id is required' });
    const results = await DetectionResult.find({ user_id: userId }).sort({ detected_at: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching detection results', error });
  }
};

// Create a new detection result
export const createDetectionResult = async (req: Request, res: Response) => {
  try {
    const detection = new DetectionResult(req.body);
    await detection.save();
    res.status(201).json(detection);
  } catch (error) {
    res.status(500).json({ message: 'Error saving detection result', error });
  }
};
