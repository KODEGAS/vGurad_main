import { Request, Response } from 'express';
import { Disease } from '../models/disease.model';

// Fetch all diseases
export const getDiseases = async (req: Request, res: Response) => {
  try {
    const diseases = await Disease.find();
    res.status(200).json(diseases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching diseases', error });
  }
};

// Fetch a single disease by ID
export const getDiseaseById = async (req: Request, res: Response) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disease', error });
  }
};

// Create a new disease
export const createDisease = async (req: Request, res: Response) => {
  try {
    const newDisease = new Disease(req.body);
    await newDisease.save();
    res.status(201).json(newDisease);
  } catch (error) {
    res.status(500).json({ message: 'Error creating disease', error });
  }
};

// Update an existing disease
export const updateDisease = async (req: Request, res: Response) => {
  try {
    const updatedDisease = await Disease.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDisease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(updatedDisease);
  } catch (error) {
    res.status(500).json({ message: 'Error updating disease', error });
  }
};

// Delete a disease
export const deleteDisease = async (req: Request, res: Response) => {
  try {
    const deletedDisease = await Disease.findByIdAndDelete(req.params.id);
    if (!deletedDisease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json({ message: 'Disease deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting disease', error });
  }
};
