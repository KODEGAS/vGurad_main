import { Request, Response } from 'express';
import { DetectionResult } from '../models/detectionResult.model';

// Get all detection results for a user
export const getDetectionResultsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id || req.body.user_id;
    if (!userId) return res.status(400).json({ message: 'user_id is required' });
    const results = await DetectionResult.find({ user_id: userId }).sort({ created_at: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching detection results', error: err });
  }
};

// Create new detection result
export const createDetectionResult = async (req: Request, res: Response) => {
  try {
    const result = new DetectionResult(req.body);
    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (err) {
    res.status(500).json({ message: 'Error creating detection result', error: err });
  }
};

// Get detection result by ID
export const getDetectionResultById = async (req: Request, res: Response) => {
  try {
    const result = await DetectionResult.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Detection result not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching detection result', error: err });
  }
};

// Delete detection result
export const deleteDetectionResult = async (req: Request, res: Response) => {
  try {
    const result = await DetectionResult.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Detection result not found' });
    res.json({ message: 'Detection result deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting detection result', error: err });
  }
};
