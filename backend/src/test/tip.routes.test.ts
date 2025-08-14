import request from 'supertest';
import express from 'express';
import tipRoutes from '../routes/tip.routes';
import { Tip } from '../models/tip.model';

// Mock the Tip model
jest.mock('../models/tip.model');
const mockTip = Tip as jest.Mocked<typeof Tip>;

const app = express();
app.use(express.json());
app.use('/api/tips', tipRoutes);

describe('Tip API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tips', () => {
    it('should return all tips', async () => {
      const mockTips = [
        {
          _id: '1',
          title: 'Proper Watering Techniques',
          content: 'Water your crops early in the morning...',
          category: 'Irrigation',
          season: 'Summer',
          difficulty: 'Easy',
          estimatedTime: '10 minutes',
          tools: ['Watering can', 'Hose'],
          crops: ['Tomato', 'Cucumber'],
          tags: ['watering', 'irrigation'],
          author: 'Farm Expert',
          dateCreated: new Date('2024-01-01'),
          likes: 25,
          views: 150
        }
      ];

      mockTip.find.mockResolvedValue(mockTips as any);

      const response = await request(app)
        .get('/api/tips')
        .expect(200);

      expect(response.body).toEqual(mockTips);
      expect(mockTip.find).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      mockTip.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/tips')
        .expect(500);

      expect(response.body.message).toBe('Error fetching tips');
    });
  });

  describe('GET /api/tips/:id', () => {
    it('should return a specific tip', async () => {
      const mockTipData = {
        _id: '1',
        title: 'Proper Watering Techniques',
        content: 'Water your crops early in the morning...',
        category: 'Irrigation',
        season: 'Summer',
        difficulty: 'Easy'
      };

      mockTip.findById.mockResolvedValue(mockTipData as any);

      const response = await request(app)
        .get('/api/tips/1')
        .expect(200);

      expect(response.body).toEqual(mockTipData);
      expect(mockTip.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent tip', async () => {
      mockTip.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/tips/nonexistent')
        .expect(404);

      expect(response.body.message).toBe('Tip not found');
    });
  });

  describe('GET /api/tips/category/:category', () => {
    it('should return tips by category', async () => {
      const mockTips = [
        {
          _id: '1',
          title: 'Watering Tips',
          category: 'Irrigation'
        }
      ];

      mockTip.find.mockResolvedValue(mockTips as any);

      const response = await request(app)
        .get('/api/tips/category/Irrigation')
        .expect(200);

      expect(response.body).toEqual(mockTips);
      expect(mockTip.find).toHaveBeenCalledWith({
        category: { $regex: 'Irrigation', $options: 'i' }
      });
    });
  });

  describe('GET /api/tips/season/:season', () => {
    it('should return tips by season', async () => {
      const mockTips = [
        {
          _id: '1',
          title: 'Summer Care',
          season: 'Summer'
        }
      ];

      mockTip.find.mockResolvedValue(mockTips as any);

      const response = await request(app)
        .get('/api/tips/season/Summer')
        .expect(200);

      expect(response.body).toEqual(mockTips);
      expect(mockTip.find).toHaveBeenCalledWith({
        season: { $regex: 'Summer', $options: 'i' }
      });
    });
  });

  describe('POST /api/tips', () => {
    it('should create a new tip', async () => {
      const newTipData = {
        title: 'New Farming Tip',
        content: 'This is a new tip...',
        category: 'General',
        season: 'All',
        difficulty: 'Medium',
        estimatedTime: '30 minutes',
        tools: ['Shovel'],
        crops: ['Corn'],
        tags: ['farming'],
        author: 'Test Author'
      };

      const savedTip = { _id: '123', ...newTipData };
      mockTip.prototype.save = jest.fn().mockResolvedValue(savedTip);

      const response = await request(app)
        .post('/api/tips')
        .send(newTipData)
        .expect(201);

      expect(response.body).toEqual(savedTip);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        title: '', // Empty title should cause validation error
        content: 'Test content'
      };

      mockTip.prototype.save = jest.fn().mockRejectedValue(
        new Error('Validation failed')
      );

      const response = await request(app)
        .post('/api/tips')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Error creating tip');
    });
  });

  describe('POST /api/tips/:id/like', () => {
    it('should increment likes for a tip', async () => {
      const mockTip_data = {
        _id: '1',
        title: 'Test Tip',
        likes: 5,
        save: jest.fn()
      };

      mockTip.findById.mockResolvedValue(mockTip_data as any);
      mockTip_data.save.mockResolvedValue({ ...mockTip_data, likes: 6 });

      const response = await request(app)
        .post('/api/tips/1/like')
        .expect(200);

      expect(response.body.likes).toBe(6);
      expect(mockTip_data.save).toHaveBeenCalledTimes(1);
    });

    it('should return 404 for non-existent tip', async () => {
      mockTip.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/tips/nonexistent/like')
        .expect(404);

      expect(response.body.message).toBe('Tip not found');
    });
  });
});
