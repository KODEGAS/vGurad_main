import request from 'supertest';
import express from 'express';
import { getExperts } from './expert.controller';
import { Expert } from '../models/expert.model';

// Mock the Expert model
jest.mock('../models/expert.model');

const app = express();
app.get('/api/experts', getExperts);

describe('Expert Controller', () => {
  describe('getExperts', () => {
    it('should return a list of experts with a 200 status code', async () => {
      const mockExperts = [
        { name: 'Dr. Smith', specialization: 'Agronomy' },
        { name: 'Dr. Jones', specialization: 'Horticulture' },
      ];
      (Expert.find as jest.Mock).mockResolvedValue(mockExperts);

      const response = await request(app).get('/api/experts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExperts);
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Expert.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/experts');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching experts', error: {} });
    });
  });
});
