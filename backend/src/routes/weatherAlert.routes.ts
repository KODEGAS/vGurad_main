import express from 'express';
import { weatherAlertController } from '../controllers/weatherAlert.controller';

const router = express.Router();

// GET /api/weather-alerts - Get all weather alerts
router.get('/', weatherAlertController.getAllAlerts);

// GET /api/weather-alerts/active - Get only active alerts
router.get('/active', weatherAlertController.getActiveAlerts);

// GET /api/weather-alerts/:id - Get specific alert by ID
router.get('/:id', weatherAlertController.getAlertById);

// POST /api/weather-alerts - Create new weather alert
router.post('/', weatherAlertController.createAlert);

// PUT /api/weather-alerts/:id - Update weather alert
router.put('/:id', weatherAlertController.updateAlert);

// PATCH /api/weather-alerts/:id/toggle - Toggle alert active status
router.patch('/:id/toggle', weatherAlertController.toggleAlertStatus);

// DELETE /api/weather-alerts/:id - Delete weather alert
router.delete('/:id', weatherAlertController.deleteAlert);

export default router;
