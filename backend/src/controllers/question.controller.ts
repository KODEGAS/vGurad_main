import { Request, Response } from 'express';
import { Question } from '../models/question.model';

// Fetch all questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};

// Submit a new question
export const createQuestion = async (req: Request, res: Response) => {
  try {
    // TODO:
    const newQuestion = new Question({
      ...req.body,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting question', error });
  }
};