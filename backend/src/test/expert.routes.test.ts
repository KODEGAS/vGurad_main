import request from 'supertest';
import express from 'express';
import expertRoutes from '../routes/expert.routes';
import { Expert } from '../models/expert.model';

// Mock the Expert model
jest.mock('../models/expert.model');
const mockExpert = Expert as jest.Mocked<typeof Expert>;

const app = express();
app.use(express.json());
app.use('/api/experts', expertRoutes);

describe('Expert API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/experts', () => {
    it('should return all experts', async () => {
      const mockExperts = [
        {
          _id: '1',
          name: 'Dr. John Smith',
          specialization: 'Plant Pathology',
          experience: 15,
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'California, USA',
          languages: ['English', 'Spanish'],
          availability: 'Available',
          rating: 4.8,
          consultationFee: 100
        },
        {
          _id: '2',
          name: 'Dr. Sarah Johnson',
          specialization: 'Crop Science',
          experience: 12,
          email: 'sarah@example.com',
          phone: '+1234567891',
          location: 'Texas, USA',
          languages: ['English'],
          availability: 'Busy',
          rating: 4.6,
          consultationFee: 85
        }
      ];

      mockExpert.find.mockResolvedValue(mockExperts as any);

      const response = await request(app)
        .get('/api/experts')
        .expect(200);

      expect(response.body).toEqual(mockExperts);
      expect(mockExpert.find).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      mockExpert.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/experts')
        .expect(500);

      expect(response.body.message).toBe('Error fetching experts');
    });
  });

  describe('GET /api/experts/:id', () => {
    it('should return a specific expert', async () => {
      const mockExpertData = {
        _id: '1',
        name: 'Dr. John Smith',
        specialization: 'Plant Pathology',
        experience: 15,
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'California, USA',
        languages: ['English', 'Spanish'],
        availability: 'Available',
        rating: 4.8,
        consultationFee: 100
      };

      mockExpert.findById.mockResolvedValue(mockExpertData as any);

      const response = await request(app)
        .get('/api/experts/1')
        .expect(200);

      expect(response.body).toEqual(mockExpertData);
      expect(mockExpert.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent expert', async () => {
      mockExpert.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/experts/nonexistent')
        .expect(404);

      expect(response.body.message).toBe('Expert not found');
    });
  });

  describe('GET /api/experts/specialization/:spec', () => {
    it('should return experts by specialization', async () => {
      const mockExperts = [
        {
          _id: '1',
          name: 'Dr. John Smith',
          specialization: 'Plant Pathology'
        }
      ];

      mockExpert.find.mockResolvedValue(mockExperts as any);

      const response = await request(app)
        .get('/api/experts/specialization/Plant%20Pathology')
        .expect(200);

      expect(response.body).toEqual(mockExperts);
      expect(mockExpert.find).toHaveBeenCalledWith({
        specialization: { $regex: 'Plant Pathology', $options: 'i' }
      });
    });
  });

  describe('GET /api/experts/available', () => {
    it('should return only available experts', async () => {
      const mockAvailableExperts = [
        {
          _id: '1',
          name: 'Dr. John Smith',
          availability: 'Available'
        }
      ];

      mockExpert.find.mockResolvedValue(mockAvailableExperts as any);

      const response = await request(app)
        .get('/api/experts/available')
        .expect(200);

      expect(response.body).toEqual(mockAvailableExperts);
      expect(mockExpert.find).toHaveBeenCalledWith({
        availability: 'Available'
      });
    });
  });

  describe('POST /api/experts', () => {
    it('should create a new expert', async () => {
      const newExpertData = {
        name: 'Dr. New Expert',
        specialization: 'Entomology',
        experience: 8,
        email: 'new@example.com',
        phone: '+1234567892',
        location: 'Florida, USA',
        languages: ['English'],
        availability: 'Available',
        rating: 4.5,
        consultationFee: 75
      };

      const savedExpert = { _id: '123', ...newExpertData };
      mockExpert.prototype.save = jest.fn().mockResolvedValue(savedExpert);

      const response = await request(app)
        .post('/api/experts')
        .send(newExpertData)
        .expect(201);

      expect(response.body).toEqual(savedExpert);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        name: '', // Empty name should cause validation error
        specialization: 'Test'
      };

      mockExpert.prototype.save = jest.fn().mockRejectedValue(
        new Error('Validation failed')
      );

      const response = await request(app)
        .post('/api/experts')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Error creating expert');
    });
  });
});
