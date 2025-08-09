import { Request, Response } from 'express';
import { Expert } from '../models/expert.model';

// Fetch all experts
export const getExperts = async (req: Request, res: Response) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experts', error });
  }
};