import request from 'supertest';
import express, { json } from 'express';
import { getQuestions, createQuestion } from './question.controller';
import { Question } from '../models/question.model';

// Mock the Question model
jest.mock('../models/question.model');

const app = express();
app.use(json());
app.get('/api/questions', getQuestions);
app.post('/api/questions', createQuestion);

describe('Question Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuestions', () => {
    it('should return a list of questions with a 200 status code', async () => {
      const mockQuestions = [
        { question: 'What is the best fertilizer for tomatoes?' },
        { question: 'How to control pests in my garden?' },
      ];
      (Question.find as jest.Mock).mockResolvedValue(mockQuestions);

      const response = await request(app).get('/api/questions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Question.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/questions');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching questions', error: {} });
    });
  });

  describe('createQuestion', () => {
    it('should create a new question and return it with a 201 status code', async () => {
      const newQuestion = { question: 'How to grow organic vegetables?' };
      const mockSavedQuestion = {
        ...newQuestion,
        status: 'pending',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        save: jest.fn().mockResolvedValue(newQuestion),
      };
      (Question as unknown as jest.Mock).mockImplementation(() => mockSavedQuestion);

      const response = await request(app).post('/api/questions').send(newQuestion);

      expect(response.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { save, ...expectedQuestion } = mockSavedQuestion;
      expect(response.body).toEqual(expectedQuestion);
    });

    it('should return a 500 status code when an error occurs', async () => {
      const newQuestion = { question: 'How to grow organic vegetables?' };
      const mockSavedQuestion = {
        ...newQuestion,
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      (Question as unknown as jest.Mock).mockImplementation(() => mockSavedQuestion);

      const response = await request(app).post('/api/questions').send(newQuestion);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error submitting question', error: {} });
    });
  });
});
