import request from 'supertest';
import express from 'express';
import { getTips } from './tip.controller';
import { Tip } from '../models/tip.model';

// Mock the Tip model
jest.mock('../models/tip.model');

const app = express();
app.get('/api/tips', getTips);

describe('Tip Controller', () => {
  describe('getTips', () => {
    it('should return a list of tips with a 200 status code', async () => {
      const mockTips = [
        { title: 'Watering your plants', content: 'Water them in the morning.' },
        { title: 'Soil health', content: 'Use compost to enrich your soil.' },
      ];
      (Tip.find as jest.Mock).mockResolvedValue(mockTips);

      const response = await request(app).get('/api/tips');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTips);
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Tip.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/tips');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching tips', error: {} });
    });
  });
});
