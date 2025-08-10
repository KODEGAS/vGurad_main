import request from 'supertest';
import express from 'express';
import diseaseRoutes from '../routes/disease.routes';
import { Disease } from '../models/disease.model';

// Mock the Disease model
jest.mock('../models/disease.model');
const mockDisease = Disease as jest.Mocked<typeof Disease>;

const app = express();
app.use(express.json());
app.use('/api/diseases', diseaseRoutes);

describe('Disease API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/diseases', () => {
    it('should return all diseases', async () => {
      const mockDiseases = [
        {
          _id: '1',
          name: 'Leaf Spot',
          description: 'Common leaf disease',
          symptoms: ['Brown spots on leaves'],
          treatment: 'Apply fungicide',
          prevention: 'Proper spacing',
          affectedCrops: ['Tomato', 'Potato'],
          severity: 'Medium',
          imageUrl: 'http://example.com/image.jpg'
        },
        {
          _id: '2',
          name: 'Powdery Mildew',
          description: 'Fungal disease',
          symptoms: ['White powdery coating'],
          treatment: 'Apply sulfur spray',
          prevention: 'Good air circulation',
          affectedCrops: ['Cucumber', 'Squash'],
          severity: 'High',
          imageUrl: 'http://example.com/image2.jpg'
        }
      ];

      mockDisease.find.mockResolvedValue(mockDiseases as any);

      const response = await request(app)
        .get('/api/diseases')
        .expect(200);

      expect(response.body).toEqual(mockDiseases);
      expect(mockDisease.find).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      mockDisease.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/diseases')
        .expect(500);

      expect(response.body.message).toBe('Error fetching diseases');
    });
  });

  describe('GET /api/diseases/:id', () => {
    it('should return a specific disease', async () => {
      const mockDisease_data = {
        _id: '1',
        name: 'Leaf Spot',
        description: 'Common leaf disease',
        symptoms: ['Brown spots on leaves'],
        treatment: 'Apply fungicide',
        prevention: 'Proper spacing',
        affectedCrops: ['Tomato', 'Potato'],
        severity: 'Medium',
        imageUrl: 'http://example.com/image.jpg'
      };

      mockDisease.findById.mockResolvedValue(mockDisease_data as any);

      const response = await request(app)
        .get('/api/diseases/1')
        .expect(200);

      expect(response.body).toEqual(mockDisease_data);
      expect(mockDisease.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent disease', async () => {
      mockDisease.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/diseases/nonexistent')
        .expect(404);

      expect(response.body.message).toBe('Disease not found');
    });
  });

  describe('GET /api/diseases/search/:crop', () => {
    it('should return diseases for specific crop', async () => {
      const mockDiseases = [
        {
          _id: '1',
          name: 'Tomato Blight',
          affectedCrops: ['Tomato'],
          severity: 'High'
        }
      ];

      mockDisease.find.mockResolvedValue(mockDiseases as any);

      const response = await request(app)
        .get('/api/diseases/search/Tomato')
        .expect(200);

      expect(response.body).toEqual(mockDiseases);
      expect(mockDisease.find).toHaveBeenCalledWith({
        affectedCrops: { $in: ['Tomato'] }
      });
    });

    it('should return empty array for crops with no diseases', async () => {
      mockDisease.find.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/diseases/search/UnknownCrop')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/diseases', () => {
    it('should create a new disease', async () => {
      const newDiseaseData = {
        name: 'New Disease',
        description: 'Test disease',
        symptoms: ['Test symptom'],
        treatment: 'Test treatment',
        prevention: 'Test prevention',
        affectedCrops: ['Test Crop'],
        severity: 'Low'
      };

      const savedDisease = { _id: '123', ...newDiseaseData };
      mockDisease.prototype.save = jest.fn().mockResolvedValue(savedDisease);

      const response = await request(app)
        .post('/api/diseases')
        .send(newDiseaseData)
        .expect(201);

      expect(response.body).toEqual(savedDisease);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        name: '', // Empty name should cause validation error
        description: 'Test'
      };

      mockDisease.prototype.save = jest.fn().mockRejectedValue(
        new Error('Validation failed')
      );

      const response = await request(app)
        .post('/api/diseases')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Error creating disease');
    });
  });
});
