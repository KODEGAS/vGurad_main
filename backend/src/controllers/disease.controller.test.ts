import request from 'supertest';
import express, { json } from 'express';
import {
  getDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
} from './disease.controller';
import { Disease } from '../models/disease.model';

// Mock the Disease model
jest.mock('../models/disease.model');

const app = express();
app.use(json());
app.get('/api/diseases', getDiseases);
app.get('/api/diseases/:id', getDiseaseById);
app.post('/api/diseases', createDisease);
app.put('/api/diseases/:id', updateDisease);
app.delete('/api/diseases/:id', deleteDisease);

describe('Disease Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDiseases', () => {
    it('should return a list of diseases with a 200 status code', async () => {
      const mockDiseases = [
        { name: 'Blight', description: 'A common plant disease' },
        { name: 'Rust', description: 'A fungal disease' },
      ];
      (Disease.find as jest.Mock).mockResolvedValue(mockDiseases);

      const response = await request(app).get('/api/diseases');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDiseases);
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Disease.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/diseases');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching diseases', error: {} });
    });
  });

  describe('getDiseaseById', () => {
    it('should return a single disease with a 200 status code', async () => {
      const mockDisease = { name: 'Blight', description: 'A common plant disease' };
      (Disease.findById as jest.Mock).mockResolvedValue(mockDisease);

      const response = await request(app).get('/api/diseases/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDisease);
    });

    it('should return a 404 status code if the disease is not found', async () => {
      (Disease.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/diseases/123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Disease not found' });
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Disease.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/diseases/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching disease', error: {} });
    });
  });

  describe('createDisease', () => {
    it('should create a new disease and return it with a 201 status code', async () => {
      const newDisease = { name: 'Powdery Mildew', description: 'A fungal disease' };
      const mockSavedDisease = { ...newDisease, save: jest.fn().mockResolvedValue(newDisease) };
      (Disease as unknown as jest.Mock).mockImplementation(() => mockSavedDisease);

      const response = await request(app).post('/api/diseases').send(newDisease);

      expect(response.status).toBe(201);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { save, ...expectedDisease } = mockSavedDisease;
      expect(response.body).toEqual(expectedDisease);
    });

    it('should return a 500 status code when an error occurs', async () => {
      const newDisease = { name: 'Powdery Mildew', description: 'A fungal disease' };
      const mockSavedDisease = { ...newDisease, save: jest.fn().mockRejectedValue(new Error('Database error')) };
      (Disease as unknown as jest.Mock).mockImplementation(() => mockSavedDisease);

      const response = await request(app).post('/api/diseases').send(newDisease);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error creating disease', error: {} });
    });
  });

  describe('updateDisease', () => {
    it('should update a disease and return it with a 200 status code', async () => {
      const updatedDisease = { name: 'Blight', description: 'An updated description' };
      (Disease.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedDisease);

      const response = await request(app).put('/api/diseases/123').send(updatedDisease);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedDisease);
    });

    it('should return a 404 status code if the disease to update is not found', async () => {
      (Disease.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put('/api/diseases/123').send({});

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Disease not found' });
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Disease.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/api/diseases/123').send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error updating disease', error: {} });
    });
  });

  describe('deleteDisease', () => {
    it('should delete a disease and return a 200 status code', async () => {
      (Disease.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'Blight' });

      const response = await request(app).delete('/api/diseases/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Disease deleted successfully' });
    });

    it('should return a 404 status code if the disease to delete is not found', async () => {
      (Disease.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/diseases/123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Disease not found' });
    });

    it('should return a 500 status code when an error occurs', async () => {
      (Disease.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/diseases/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error deleting disease', error: {} });
    });
  });
});
