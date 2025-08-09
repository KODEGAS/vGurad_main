import { Request, Response } from 'express';
import { Tip } from '../models/tip.model';

// Fetch all tips
export const getTips = async (req: Request, res: Response) => {
  try {
    const tips = await Tip.find();
    res.status(200).json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tips', error });
  }
};
