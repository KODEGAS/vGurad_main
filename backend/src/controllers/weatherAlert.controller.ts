import { Request, Response } from 'express';
import WeatherAlert from '../models/weatherAlert.model';

export const weatherAlertController = {
  // Get all weather alerts
  getAllAlerts: async (req: Request, res: Response) => {
    try {
      const alerts = await WeatherAlert.find()
        .sort({ created_at: -1 });
      
      res.status(200).json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather alerts',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get active alerts only
  getActiveAlerts: async (req: Request, res: Response) => {
    try {
      const alerts = await WeatherAlert.find({ is_active: true })
        .sort({ created_at: -1 });
      
      res.status(200).json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active alerts',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get single alert by ID
  getAlertById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const alert = await WeatherAlert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Weather alert not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: alert
      });
    } catch (error) {
      console.error('Error fetching weather alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Create new weather alert
  createAlert: async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        alert_type,
        severity,
        location,
        start_date,
        end_date
      } = req.body;

      // Validation
      if (!title || !description || !alert_type) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and alert type are required'
        });
      }

      const newAlert = new WeatherAlert({
        title,
        description,
        alert_type,
        severity: severity || 'medium',
        location,
        start_date: start_date || new Date(),
        end_date,
        is_active: true
      });

      const savedAlert = await newAlert.save();
      
      res.status(201).json({
        success: true,
        message: 'Weather alert created successfully',
        data: savedAlert
      });
    } catch (error) {
      console.error('Error creating weather alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create weather alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Update weather alert
  updateAlert: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Add updated_at timestamp
      updateData.updated_at = new Date();

      const updatedAlert = await WeatherAlert.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAlert) {
        return res.status(404).json({
          success: false,
          message: 'Weather alert not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Weather alert updated successfully',
        data: updatedAlert
      });
    } catch (error) {
      console.error('Error updating weather alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update weather alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Toggle alert active status
  toggleAlertStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const alert = await WeatherAlert.findById(id);
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Weather alert not found'
        });
      }

      alert.is_active = !alert.is_active;
      alert.updated_at = new Date();
      const updatedAlert = await alert.save();

      res.status(200).json({
        success: true,
        message: `Alert ${updatedAlert.is_active ? 'activated' : 'deactivated'} successfully`,
        data: updatedAlert
      });
    } catch (error) {
      console.error('Error toggling alert status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle alert status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Delete weather alert
  deleteAlert: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const deletedAlert = await WeatherAlert.findByIdAndDelete(id);
      
      if (!deletedAlert) {
        return res.status(404).json({
          success: false,
          message: 'Weather alert not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Weather alert deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting weather alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete weather alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
